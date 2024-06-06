import Head from "next/head";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SelectorIcon, DuplicateIcon } from "@heroicons/react/outline";
import toast, { Toaster } from "react-hot-toast";

let host = "";
if (typeof window !== "undefined") {
  host = window.location.origin;
}

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [target, setTarget] = useState("clash");

  function getUrlHost(url) {
    let urlHost = "";
    try {
      urlHost = new URL(url).hostname;
    } catch (error) {
      // Ignore
    }
    return urlHost;
  }

  const convertedUrls = urls.map((url) => {
    const convertedUrl = `${host}/api/convert?url=${encodeURIComponent(url)}&target=${target}`;
    const urlHost = getUrlHost(url);
    return { url, convertedUrl, urlHost };
  });

  const copiedToast = () =>
    toast("已复制", {
      position: "bottom-center",
    });

  const clashConfig = `# Clash 配置格式

proxy-providers:
  ${urlHost || "provider1"}:
    type: http
    url: ${convertedUrls[0]?.convertedUrl}
    interval: 600
    path: ./${urlHost || "provider1"}.yaml
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
`;

  const surgeConfig = `# Surge 配置格式

[Proxy Group]
${urlHost || "egroup"} = select, policy-path=${convertedUrls[0]?.convertedUrl}
`;

  const handleUrlChange = (index, e) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = e.target.value;
    setUrls(updatedUrls);
  };

  const handleAddUrl = () => {
    setUrls([...urls, ""]);
  };

  const handleRemoveUrl = (index) => {
    const updatedUrls = [...urls];
    updatedUrls.splice(index, 1);
    setUrls(updatedUrls);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Proxy Provider Converter</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <main className="flex flex-col items-start flex-1 max-w-4xl px-4 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold text-black md:text-5xl">
          Proxy Provider Converter
        </h1>

        <div className="w-full text-gray-900 mt-14">
          <h3 className="text-lg md:text-xl font-bold">开始使用</h3>
          <div className="flex w-full gap-4 mt-4 flex-col md:flex-row">
            {urls.map((url, index) => (
              <input
                key={index}
                className="w-full h-full p-4 text-lg bg-white rounded-lg shadow-sm focus:outline-none"
                placeholder="粘贴 Clash 订阅链接到这里"
                value={url}
                onChange={(e) => handleUrlChange(index, e)}
              />
            ))}
            <button
              className="p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              onClick={handleAddUrl}
            >
              添加链接
            </button>
          </div>
        </div>
        {convertedUrls.map(({ url, convertedUrl, urlHost }, index) => (
          <div key={index} className="break-all p-3 mt-4 rounded-lg text-gray-100 bg-gray-900 shadow-sm w-full">
            {convertedUrl}

            <CopyToClipboard text={convertedUrl} onCopy={() => copiedToast()}>
              <div className="flex items-center text-sm mt-4 text-gray-400 cursor-pointer hover:text-gray-300 transition duration-200 select-none">
                <DuplicateIcon className="h-5 w-5 mr-1 inline-block" />
                点击复制
              </div>
            </CopyToClipboard>
          </div>
        ))}
        {convertedUrls.length > 0 && (
          <div className="w-full p-4 mt-4 text-gray-100 bg-gray-900 rounded-lg hidden md:block">
            {target !== "surge" && <pre className="whitespace-pre-wrap">{clashConfig}</pre>}

            {target === "surge" && <pre>{surgeConfig}</pre>}

            <CopyToClipboard
              text={target === "surge" ? surgeConfig : clashConfig}
              onCopy={() => copiedToast()}
            >
              <div className="flex items-center text-sm mt-4 text-gray-400 cursor-pointer hover:text-gray-300 transition duration-200 select-none">
                <DuplicateIcon className="h-5 w-5 mr-1 inline-block" />
                点击复制
              </div>
            </CopyToClipboard>
          </div>
        )}
      </main>

      <footer className="w-full p-4 max-w-4xl md:py-8">
        <a
          className="flex items-center"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>

      <Toaster />
    </div>
  );
}
