const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'blogs');
const outputFilePath = path.join(__dirname, 'blogs-data.json'); // 输出数据文件路径

// 解析 Markdown frontmatter (与浏览器端类似，但使用 Node.js API)
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    if (!match) return { frontmatter: {}, content: content.trim() }; // 如果没有 frontmatter，返回空对象和原始内容

    const frontmatter = {};
    const frontmatterLines = match[1].split(/\r?\n/); // 处理 Windows 和 Unix 换行符
    frontmatterLines.forEach(line => {
        const parts = line.split(': ');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(': ').trim();
             // 尝试将 isSticky 转换为布尔值
            if (key === 'isSticky') {
                 frontmatter[key] = value.toLowerCase() === 'true';
            } else {
                frontmatter[key] = value;
            }
        }
    });

    return {
        frontmatter,
        content: match[2].trim()
    };
}

// 获取博客内容预览（例如前 150 个字符）
function getContentPreview(markdownContent) {
    // 移除 Markdown 标题、加粗等标记，只保留纯文本
    let plainText = markdownContent
        .replace(/^#+\s+/gm, '') // 移除标题标记
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
        .replace(/(\*|_)(.*?)\1/g, '$2')   // 移除斜体
        .replace(/`{1,3}[^`]+`{1,3}/g, '') // 移除代码块
        .replace(/!\[.*?\]\(.*?\)/g, '')  // 移除图片
        .replace(/\[.*?\]\(.*?\)/g, '')    // 移除链接文字（保留链接地址可能不太合适，先去掉）
        .replace(/\r?\n/g, ' ')          // 替换换行为空格
        .replace(/\s{2,}/g, ' ')         // 合并多个空格
        .trim();

    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
}


async function generateBlogData() {
    const blogData = [];
    try {
        const blogFolders = fs.readdirSync(blogsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory()); // 只读取子目录

        for (const folder of blogFolders) {
            const blogFolderPath = path.join(blogsDir, folder.name);
            const markdownFilePath = path.join(blogFolderPath, 'blog.md'); // 假设博客文件名为 blog.md

            if (fs.existsSync(markdownFilePath)) {
                const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
                const { frontmatter, content } = parseFrontmatter(markdownContent);

                // 确保有标题和日期，否则跳过
                if (!frontmatter.title || !frontmatter.date) {
                     console.warn(`Skipping folder "${folder.name}" due to missing title or date in frontmatter.`);
                    continue;
                }

                const blogEntry = {
                    id: folder.name, // 使用文件夹名称作为 ID
                    title: frontmatter.title,
                    date: frontmatter.date,
                    isSticky: frontmatter.isSticky || false, // 默认不置顶
                    // content: content // 完整内容可能太大，用于列表页不合适
                    content: getContentPreview(content) // 使用内容预览
                };
                blogData.push(blogEntry);
            } else {
                 console.warn(`Markdown file (blog.md) not found in folder: ${folder.name}`);
            }
        }

        // 按日期降序排序 (最新的在前面)，置顶的优先
        blogData.sort((a, b) => {
            // 先比较 isSticky
             if (a.isSticky && !b.isSticky) return -1;
             if (!a.isSticky && b.isSticky) return 1;
             // isSticky 相同或都为 false 时，比较日期
             // 注意：直接比较 'YYYY.MM.DD HH:MM:SS' 格式的字符串可能不准确，最好转换为 Date 对象
             // 为简单起见，这里假设格式固定且字符串比较有效，如果日期格式复杂可能需要调整
             const dateA = new Date(a.date.replace(/\./g, '-')); // 尝试转换为 JS Date 可识别的格式
             const dateB = new Date(b.date.replace(/\./g, '-'));
             return dateB - dateA; // 降序
        });


        fs.writeFileSync(outputFilePath, JSON.stringify(blogData, null, 2), 'utf-8');
        console.log(`Successfully generated blog data to ${outputFilePath}`);
        console.log(`Found ${blogData.length} blog entries.`);

    } catch (error) {
        console.error('Error generating blog data:', error);
    }
}

generateBlogData();
