const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const startDir = process.argv[2];
const className = "nested";

if (!startDir) {
  console.error("Error: Missing path argument");
  process.exit(1);
}

function processFile(filePath) {
  // read the file contents
  const fileContents = fs.readFileSync(filePath, "utf8");

  // load the HTML into a Cheerio object
  const $ = cheerio.load(fileContents);

  // find all <div class="msg"> elements containing an <em> element
  const em = $("div.msg > p > strong > em");
  em.parent().parent().parent().parent().parent().parent().addClass(className);
  em.parent().remove();

  // write the updated HTML back to the file
  fs.writeFileSync(filePath, $.html(), "utf8");
  console.log("Written to " + filePath);
}

function processDirectory(dirPath) {
  // read the contents of the directory
  const files = fs.readdirSync(dirPath);

  // process each file or subdirectory
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    // if it's a directory, recursively process it
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    }

    // if it's an HTML file, process it
    if (path.extname(filePath).toLowerCase() === ".html") {
      processFile(filePath);
    }
  });
}

// Check if the path exists
if (fs.existsSync(startDir)) {
  processDirectory(startDir);
} else {
  console.error(`Error: Path "${startDir}" does not exist`);
  process.exit(1);
}
