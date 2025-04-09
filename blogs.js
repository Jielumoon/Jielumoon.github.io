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

// 获取博客列表
async function getBlogs() {
    try {
        // 从blogs目录读取所有博客文件夹
        const blogFolders = await fs.promises.readdir('./blogs');
        
        const blogs = [];
        
        // 遍历每个博客文件夹
        for (const folder of blogFolders) {
            if (folder === '.gitkeep') continue;
            
            const folderPath = path.join('./blogs', folder);
            const stat = await fs.promises.stat(folderPath);
            
            // 确保是目录
            if (stat.isDirectory()) {
                // 读取该目录下的markdown文件
                const files = await fs.promises.readdir(folderPath);
                const mdFile = files.find(file => file.endsWith('.md'));
                
                if (mdFile) {
                    const content = await fs.promises.readFile(
                        path.join(folderPath, mdFile),
                        'utf-8'
                    );
                    
                    // 解析markdown文件的frontmatter和内容
                    const { data: metadata, content: blogContent } = matter(content);
                    
                    blogs.push({
                        id: `blog-${Date.now()}-${blogs.length}`,
                        title: metadata.title || folder,
                        date: metadata.date || formatDateTime(stat.birthtime),
                        isSticky: metadata.isSticky || false,
                        content: blogContent
                    });
                }
            }
        }
        
        // 按置顶状态和日期排序
        return blogs.sort((a, b) => {
            if (a.isSticky !== b.isSticky) {
                return (b.isSticky || false) - (a.isSticky || false);
            }
            return new Date(b.date) - new Date(a.date);
        });
        
    } catch (error) {
        console.error('获取博客数据时出错:', error);
        return [{
            title: "博客加载中...",
            date: formatDateTime(new Date()),
            content: "博客数据正在加载，请稍候..."
        }];
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
function startDynamicTimeUpdate() {
    updateDynamicTime(); // 立即更新一次
    setInterval(updateDynamicTime, 1000); // 每秒更新一次
}

// 将函数暴露为全局变量
window.getBlogs = getBlogs;
window.startDynamicTimeUpdate = startDynamicTimeUpdate;