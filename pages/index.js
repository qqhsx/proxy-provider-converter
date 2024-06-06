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

  const generateClashConfig = () => {
    const clashConfigs = convertedUrls.map(({ urlHost, convertedUrl }) => `
      ${urlHost}:
        type: http
        url: ${convertedUrl}
        interval: 3600
        path: ./${urlHost}.yaml
        health-check:
          enable: true
          interval: 600
          url: http://www.gstatic.com/generate_204
    `);
    return `# Clash 配置格式

proxy-groups:
  - name: UseProvider
    type: select
    use:
      ${convertedUrls.map(({ urlHost }) => `- ${urlHost}`).join("\n")}
    proxies:
      - Proxy
      - DIRECT

proxy-providers:
  ${clashConfigs.join("\n")}
`;
  };

  const generateSurgeConfig = () => {
    const surgeConfigs = convertedUrls.map(({ urlHost, convertedUrl }) => `
[${urlHost}]
= select, policy-path=${convertedUrl}
    `);
    return `# Surge 配置格式

[Proxy Group]
${convertedUrls.map(({ urlHost }) => `${urlHost} = select, policy-path=${urlHost}`).join("\n")}
`;
  };

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
        {/* Remaining code is the same */}
      </main>

      <Toaster />
    </div>
  );
}
