export function getJsonFromURL(url: string) {
  // Get data from url
  const urlObj = new URL(url);
  const dataParam = urlObj.searchParams.get("data");
  if (!dataParam) {
    return undefined;
  }

  // Convert URL-safe base64 to standard base64
  const base64String = dataParam.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if missing
  const pad = base64String.length % 4;
  const paddedBase64 = pad ? base64String + "=".repeat(4 - pad) : base64String;

  // Decode base64 to Uint8Array
  function base64ToUint8Array(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const bytes = base64ToUint8Array(paddedBase64);

  // Decode UTF-8 bytes to string
  const decodedJson = new TextDecoder("utf-8").decode(bytes);

  const parsedData = JSON.parse(decodedJson);

  if (parsedData.messages && parsedData.messages.length > 0) {
    const embeds = parsedData.messages[0].data.embeds;
    const content = parsedData.messages[0].data.content;
    return {
      embeds: embeds,
      content: content,
    };
  }
}
