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

  const convertedUrls = urls.map((url) => ({
    url,
    convertedUrl: `${host}/api/convert?url=${encodeURIComponent(url)}&target=${target}`,
    urlHost: getUrlHost(url),
  }));

  function getUrlHost(url) {
    let urlHost = "";
    try {
      urlHost = new URL(url).hostname;
    } catch (error) {
      // Ignore
    }
    return urlHost;
  }

  const copiedToast = () =>
    toast("已复制", {
      position: "bottom-center",
    });

  const clashConfig = `# Clash 配置格式

proxy-groups:
  - name: UseProvider
    type: select
    use:
      - ${urlHost || "provider1"}
    proxies:
      - Proxy
      - DIRECT

proxy-providers:
  ${urlHost || "provider1"}:
    type: http
    url: ${convertedUrl}
    interval: 3600
    path: ./${urlHost || "provider1"}.yaml
    health-check:
      enable: true
      interval: 600
      # lazy: true
      url: http://www.gstatic.com/generate_204
`;

  const surgeConfig = `# Surge 配置格式

[Proxy Group]
${urlHost || "egroup"} = select, policy-path=${convertedUrl}
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
        <div className="flex flex-col items-start md:items-center md:flex-row">
          <img src="/logo.svg" alt="Logo" className="md:mr-4 h-28" />
          <div>
            <h1 className="text-2xl font-extrabold text-black md:text-5xl">
              Proxy Provider Converter
            </h1>
            <p className="mt-2 md:text-lg text-gray-600">
              一个可以将 Clash 订阅转换成 Proxy Provider 和 External
              Group(Surge) 的工具
            </p>
          </div>
        </div>
        <div className="mt-12 text-gray-900">
          <h3 className="text-lg md:text-xl font-bold">
            什么是 Proxy Provider 和 External Group？
          </h3>
          <p className="mt-2">
            <a
              href="https://github.com/Dreamacro/clash/wiki/configuration#proxy-providers"
              className="text-yellow-600 transition hover:text-yellow-500"
            >
              Proxy Provider
            </a>{" "}
            是 Clash
            的一项功能，可以让用户从指定路径动态加载代理服务器列表。使用这个功能你可以将
            Clash
            订阅里面的代理服务器提取出来，放到你喜欢的配置文件里，也可以将多个
            Clash 订阅里的代理服务器混合到一个配置文件里。External Group 则是
            Proxy Provider 在 Surge 里的叫法，作用是一样的。
          </p>
        </div>
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
        {/* Remaining code is the same */}
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
