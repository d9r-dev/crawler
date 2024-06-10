import { JSDOM } from "jsdom";

const normalizeURL = (url) => {
    let urlObject = {};
    try {
        urlObject = new URL(url);
    } catch (error) {
        console.log(error.message);
        return null;
    }
    if (urlObject) {
        let fullPath = `${urlObject.hostname}${urlObject.pathname}`;
        if (fullPath.slice(-1) === "/") {
            fullPath = fullPath.slice(0, -1);
        }
        return fullPath;
    }

    return null;
};

function getURLsFromHTML(html, baseURL) {
    const urls = [];
    const dom = new JSDOM(html);
    const anchors = dom.window.document.querySelectorAll("a");

    for (const anchor of anchors) {
        if (anchor.hasAttribute("href")) {
            let href = anchor.getAttribute("href");

            try {
                // convert any relative URLs to absolute URLs
                href = new URL(href, baseURL).href;
                urls.push(href);
            } catch (err) {
                console.log(`${err.message}: ${href}`);
            }
        }
    }

    return urls;
}

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {
    const currenURLObject = new URL(currentUrl);
    const baseURLObject = new URL(baseUrl);
    if (currenURLObject.hostname !== baseURLObject.hostname) {
        return pages;
    }

    const normalizedUrl = normalizeURL(currentUrl);

    if (pages[normalizedUrl] > 0) {
        pages[normalizedUrl]++;
        return pages;
    }

    pages[normalizedUrl] = 1;
    console.log(`crawling ${currentUrl}`);
    let html = "";

    try {
        const res = await fetch(currentUrl, {
            method: "GET",
        });
        if (res.status > 399) {
            throw new Error("Request could not be made.");
        }
        if (
            !res.headers.get("Content-Type") ||
            !res.headers.get("Content-Type").includes("text/html")
        ) {
            throw new Error("Not a HTML document");
        }
        html = await res.text();
    } catch (error) {
        console.log(error.message);
        return pages;
    }

    const nextURLs = getURLsFromHTML(html, baseUrl);
    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseUrl, nextURL, pages);
    }

    return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage };
