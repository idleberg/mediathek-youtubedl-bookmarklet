const invalidCharacters = new RegExp('[<>:"/\\|?*]+', 'g');
const mvwOrigin = 'https://mediathekviewweb.de';

function getRows() {
  const rows = Array.from(document.querySelectorAll('table#mediathek tbody tr'));

  return rows.length
    ? rows
    : [];
}

function getCommandLine(tableRows) {
  return [...tableRows].map((item) => {
    const videoUrl = item.lastChild.lastChild.href;
    const outName = item.childNodes[2].innerText.replace(invalidCharacters, '');

    return `youtube-dl ${videoUrl} --output "${outName}.mp4"`;
  });
}

function isEligibleOrigin() {
  if (window.location.origin !== mvwOrigin) {
    if (confirm(`This bookmarklet only works on ${mvwOrigin}. Do you want to go there?`)) {
      window.location = mvwOrigin;
    }

    return false;
  }

  return true;
}

async function writeToClipboard(commandList) {
  try {
    await navigator.clipboard.writeText(commandList);
  } catch (err) {
    console.error(err);
    alert('Copying to clipboard failed, see console for details');

    return;
  }
}

(async () => {
  if (!isEligibleOrigin()) return;

  const tableRows = getRows();

  if (!tableRows.length) {
    alert('No results found on page');
    return;
  }

  const list = getCommandLine(tableRows);
  const commandList = list.join('\n');

  if (localStorage.getItem('youtube-dl.showInAlert') === "true") {
    alert(commandList);
  } else {
    alert(`Successfully copied ${list.length} items to clipboard`);
    await writeToClipboard(commandList);
  }
})();
