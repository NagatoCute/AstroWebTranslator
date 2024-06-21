document.addEventListener("DOMContentLoaded", () => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange");
    const fromLangSelect = document.querySelector(".from-lang-select");
    const toLangSelect = document.querySelector(".to-lang-select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.getElementById("translate-btn");
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const ocrBtn = document.getElementById('ocr-btn');
    const downloadBtn = document.getElementById('download-btn');
    let currentFileType = '';

    // 交换文本和语言选择
    exchangeIcon.addEventListener("click", () => {
        const tempText = fromText.value;
        const tempLang = fromLangSelect.value;
        fromText.value = toText.value;
        toText.value = tempText;
        fromLangSelect.value = toLangSelect.value;
        toLangSelect.value = tempLang;
    });

    // 复制文本到剪贴板并朗读文本
    icons.forEach(icon => {
        icon.addEventListener("click", async ({ target }) => {
            if (!fromText.value || !toText.value) return;

            if (target.classList.contains("fa-copy")) {
                await navigator.clipboard.writeText(target.id.startsWith('from') ? fromText.value : toText.value);
            } else {
                const utterance = new SpeechSynthesisUtterance(target.id.startsWith('from') ? fromText.value : toText.value);
                utterance.lang = target.id.startsWith('from') ? fromLangSelect.value : toLangSelect.value;
                speechSynthesis.speak(utterance);
            }
        });
    });

    // 翻译输入文本
    translateBtn.addEventListener("click", async () => {
        const text = fromText.value.trim();
        if (!text) return;

        toText.setAttribute("placeholder", "正在翻译...");
        try {
            const translateFrom = fromLangSelect.value;
            const translateTo = toLangSelect.value;
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            toText.value = data.responseData.translatedText || (data.matches.find(m => m.id === 0)?.translation || '');
            toText.setAttribute("placeholder", "翻译结果");
        } catch (error) {
            alert("翻译时发生错误：" + error.message);
            toText.setAttribute("placeholder", "发生错误");
        }
    });

    // 上传并翻译文件
    uploadBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("请先选择一个文件");
            return;
        }

        currentFileType = file.name.split('.').pop().toLowerCase();

        let text = '';
        if (currentFileType === 'docx') {
            text = await readDocx(file);
        } else if (currentFileType === 'md') {
            text = await readMarkdown(file);
        } else if (currentFileType === 'txt') {
            text = await readText(file);
        }

        fromText.value = text;
        await translateText(text, fromLangSelect.value, toLangSelect.value);
    });

    // 上传图片并进行OCR识别
    ocrBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("请先选择一个图片文件");
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert("请选择一个有效的图片文件");
            return;
        }

        fromText.value = "正在识别图像中的文字...";
        try {
            const text = await recognizeText(file);
            fromText.value = text;
        } catch (error) {
            alert("OCR识别时发生错误：" + error.message);
            fromText.value = "";
        }
    });

    async function recognizeText(file) {
        const { createWorker } = Tesseract;
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        return text;
    }

    async function translateText(text, fromLang, toLang) {
        toText.setAttribute("placeholder", "正在翻译...");
        try {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            toText.value = data.responseData.translatedText || (data.matches.find(m => m.id === 0)?.translation || '');
            toText.setAttribute("placeholder", "翻译结果");
        } catch (error) {
            alert("翻译时发生错误：" + error.message);
            toText.setAttribute("placeholder", "发生错误");
        }
    }

    async function readDocx(file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const content = new Uint8Array(reader.result);
                    const zip = new PizZip(content);
                    const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
                    resolve(doc.getFullText());
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
        });
    }

    async function readMarkdown(file) {
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    async function readText(file) {
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    // 下载翻译后的文本
    downloadBtn.addEventListener('click', () => {
        const translatedText = toText.value;
        const blob = new Blob([translatedText], { type: 'text/plain' });
        const filename = 'translated_text.txt';

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
