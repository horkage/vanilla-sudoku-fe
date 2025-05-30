import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#EEE9DA]">
      <div className="flex justify-center items-start">
        <div className="bg-white border border-[#333333] w-[90%] md:w-[75%] p-6 mt-3">
          <h1 className="text-2xl font-semibold text-[#333333]">Hello World</h1>
        </div>
      </div>
    </main>
  );
}
