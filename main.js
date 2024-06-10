import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

const args = process.argv;

if (args.length !== 3) {
    console.log(`usage: node main <start-url>`);
} else {
    console.log(`Start crawling from start url ${args[2]}`);
    const pages = await crawlPage(args[2]);

    printReport(pages);
}
