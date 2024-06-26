
# 语言翻译器

这是一个基于Astro框架开发的简易语言翻译器项目。通过这个翻译器，用户可以输入文本、上传文件，并进行多语言翻译和下载翻译结果。

## 功能

- **文本输入翻译**：用户可以直接在输入框中输入文本，并选择源语言和目标语言进行翻译。
- **文件上传翻译**：支持上传.docx、.md、.txt格式的文件进行翻译。系统会自动识别文件类型并提取文本进行翻译。
- **语言选择**：提供了从多种语言中选择的下拉菜单，方便用户选择源语言和目标语言。
- **翻译结果下载**：用户可以将翻译后的结果下载为.txt文件。
- **交换语言**：用户可以通过点击交换图标来快速交换输入框中的文本和语言选择。

## 安装和运行

1. **克隆项目仓库**：

   ```bash
   git clone https://github.com/NagatoCute/AstroWebTranslator
   cd project-directory
   ```

2. **安装依赖**：

   ```bash
   npm install
   ```

3. **运行开发服务器**：

   ```bash
   npm run dev
   ```

   运行后访问 `http://localhost:4321` 查看项目。

## 技术栈

- **Astro**：静态站点生成器和前端框架。
- **HTML/CSS/JavaScript**：基础的Web前端开发语言和样式。
- **API**：使用MyMemory翻译API进行文本翻译服务。

## 使用说明

- **输入文本**：在"输入文本"文本框中输入待翻译的文本。
- **选择语言**：从源语言和目标语言的下拉菜单中选择语言。
- **点击翻译按钮**：点击"翻译输入文本"按钮进行文本翻译。
- **上传图片并OCR**：点击"上传图片并OCR"按钮进行识别图中文字（仅支持英文）。
- **上传文件**：点击"上传文件并翻译"按钮选择待翻译的文件，支持docx，txt，md与image。
- **下载翻译结果**：点击"下载翻译结果"按钮下载翻译后的文本结果，上传.md文件会下载md文件，其它则是txt文件。

## 贡献

欢迎对项目进行改进和优化。您可以提交问题(issue)或者提出合并请求(pull request)来增加新功能或改进现有功能。

## License

MIT License. 参见 [LICENSE](./LICENSE.md) 文件了解更多详情。
