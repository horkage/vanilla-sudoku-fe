#!/bin/bash

set -e
PROJECT_NAME=vanilla-sudoku
BUILD_DIR=${PROJECT_NAME}
ARCHIVE_NAME=${BUILD_DIR}.tar
REMOTE_USER=ubuntu
REMOTE_HOST=ec2-34-213-198-118.us-west-2.compute.amazonaws.com
REMOTE_DIR=/home/ubuntu
PEM_FILE=/home/mwood/.ssh/mw_ssh_rsa_oregon.pem

# Step out of project dir and copy clean workspace
cd ..
cp -rip sudoku-refactor $BUILD_DIR
rm -rf $BUILD_DIR/.next $BUILD_DIR/node_modules

# Package for upload
tar -cf $ARCHIVE_NAME $BUILD_DIR

# Upload
scp -i $PEM_FILE $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# Remote deploy
ssh -i $PEM_FILE $REMOTE_USER@$REMOTE_HOST << EOF
  bash -l -c '
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20

    set -e
    cd $REMOTE_DIR

    # Backup current live directory (if it exists)
    if [ -d "$BUILD_DIR" ]; then
      TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
      cp -rip $BUILD_DIR ${BUILD_DIR}_backup_\$TIMESTAMP
      echo "🔄 Backup created: ${BUILD_DIR}_backup_\$TIMESTAMP"
    fi

    # Unpack new code
    rm -rf $BUILD_DIR
    tar -xf $ARCHIVE_NAME

    # Build new version
    cd $BUILD_DIR
    npm install
    if npm run build; then
      echo "✅ Build succeeded, restarting PM2"
      pm2 restart sudoku
    else
      echo "❌ Build failed. Reverting..."
      cd ..
      rm -rf $BUILD_DIR
      LATEST_BACKUP=\$(ls -td ${BUILD_DIR}_backup_* | head -1)
      if [ -d "\$LATEST_BACKUP" ]; then
        mv \$LATEST_BACKUP $BUILD_DIR
        echo "🔁 Rolled back to \$LATEST_BACKUP"
        pm2 restart sudoku
      else
        echo "⚠️ No backup found to revert to!"
      fi
      exit 1
    fi

    # Clean up
    rm -f $ARCHIVE_NAME
  '
EOF

# Clean up local archive
rm -f $ARCHIVE_NAME

echo "✅ Deployment complete."
