const invalidCharacters = new RegExp('[<>:"/\\|?*]+', 'g');
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const mvwOrigin = 'https://mediathekviewweb.de';

function getRows() {
  return Array.from(document.querySelectorAll('table#mediathek tbody tr'));
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
  const result = await navigator.permissions.query({
    name: 'clipboard-write',
  });

  if (result.state == 'granted' || result.state == 'prompt') {
    try {
      await navigator.clipboard.writeText(commandList);
    } catch (err) {
      console.error(err);
      alert('Copying to clipboard failed, see console for details');

      return;
    }
  }
}

(async () => {
  if (!isEligibleOrigin()) return;

  const tableRows = getRows();
  const list = getCommandLine(tableRows);
  const commandList = list.join('\n');

  if (isFirefox) {
    alert(commandList);
  } else {
    await writeToClipboard(commandList);
    alert(`Successfully copied ${list.length} items to clipboard`);
  }
})();
