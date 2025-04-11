// 格式化日期时间
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

// 解析Markdown文件的frontmatter
export function parseFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    if (!match) return null;

    const frontmatter = {};
    const frontmatterLines = match[1].split('\n');
    frontmatterLines.forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
            frontmatter[key.trim()] = value.trim();
        }
    });

    return {
        frontmatter,
        content: match[2].trim()
    };
}

// 获取博客数据
export async function getDefaultBlogs() {
    try {
        // 从生成的 JSON 文件加载博客数据
        const response = await fetch('./blogs-data.json'); // 请求同目录下的 blogs-data.json
        if (!response.ok) {
            // 如果请求失败（例如文件不存在或服务器错误），抛出错误
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogs = await response.json(); // 解析 JSON 数据
        return blogs; // 返回从文件加载的博客数组
    } catch (error) {
        console.error('Error loading blogs from JSON file:', error);
        // 出错时返回空数组或显示错误信息
        return [];
    }
}

// 更新动态时间显示
function updateDynamicTime() {
    const timeElement = document.getElementById('dynamic-time');
    if (timeElement) {
        timeElement.textContent = formatDateTime(new Date());
    }
}

// 启动动态时间更新
export function startDynamicTimeUpdate() {
    updateDynamicTime(); // 立即更新一次
    setInterval(updateDynamicTime, 1000); // 每秒更新一次
}

// 渲染博客列表 (移除调试代码后)
export function renderBlogs(blogsToRender) {
    // console.log("RenderBlogs called with:", blogsToRender); // 确认调用和数据
    const blogList = document.getElementById('blog-list');
    if (!blogList) {
        // 保留这个基础检查，因为它对功能很重要
        console.error("Element with ID 'blog-list' not found!");
        return;
    }
    blogList.innerHTML = ''; // 清空旧内容

    if (blogsToRender && blogsToRender.length > 0) {
         blogsToRender.forEach(blog => {
            // 移除了 try...catch
            const blogContainer = document.createElement('div');
            blogContainer.className = 'container blog-container';
            // 保持使用 encodeURIComponent
            blogContainer.innerHTML = `
                <div class="title">${blog.isSticky ? '<span class="sticky-badge">置顶</span> ' : ''}📄<a href="blog-detail.html?id=${encodeURIComponent(blog.id)}" style="color: inherit; text-decoration: none;">${blog.title}</a></div>
                <div class="date">📅 ：${blog.date}</div>
                <div class="content">${blog.content}</div>
            `;
            blogList.appendChild(blogContainer);
            // 移除了 console.log(`Appended blog container...`)
        });
    } else {
         blogList.innerHTML = '<div class="container blog-container"><div class="title">暂无博客</div><div class="content">目前没有可显示的博客内容。</div></div>';
         // 移除了 console.log("Rendered 'No blogs' message.")
    }
}

// 初始化博客数据并渲染
async function initializePage() {
    // 移除这里的调试日志
    // console.log("initializePage called.");
    try {
        // console.log("Calling getDefaultBlogs...");
        const blogs = await getDefaultBlogs();
        // console.log("getDefaultBlogs returned:", blogs);
        renderBlogs(blogs);
    } catch (error) {
        console.error('初始化博客时出错:', error);
         const blogList = document.getElementById('blog-list');
         if(blogList) {
             blogList.innerHTML = '<div class="container blog-container"><div class="title">加载博客出错</div></div>';
         }
    }
    // 如果需要启动动态时间，也在这里调用
    // startDynamicTimeUpdate();
}

// 确保在 DOM 加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// 如果 index.html 的其他内联脚本（如搜索）也需要 getDefaultBlogs,
// 需要将 searchBlogs 函数也移到这里或另一个模块，并导出 getDefaultBlogs
// 或者，如果 searchBlogs 必须在 index.html, 则需要在 index.html 的模块脚本中导入 getDefaultBlogs

// --- 结束初始化逻辑 ---