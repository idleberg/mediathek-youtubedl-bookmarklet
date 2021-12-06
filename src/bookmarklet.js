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
    const executable = localStorage.getItem('youtube-dl.executable') || 'youtube-dl';

    return `${executable} ${videoUrl} --output "${outName}.mp4"`;
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

async function writeToClipboard(commandList, length) {
  try {
    await navigator.clipboard.writeText(commandList);
    alert(`Successfully copied ${length} items to clipboard`);
  } catch (err) {
    console.error(err);
    alert('Copying to clipboard failed, see console for details');

    return;
  }
}

(async () => {
  if (!isEligibleOrigin()) return;

  window.focus();
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
    await writeToClipboard(commandList, list.length);
  }
})();
