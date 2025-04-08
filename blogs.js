// 获取实时天气数据的函数
async function getWeatherData() {
    try {
        const response = await fetch('https://cn.apihz.cn/api/tianqi/tqyb.php?id=88888888&key=88888888&sheng=安徽&place=池州');
        const data = await response.json();
        if (data.code === 200) {
            return `${data.weather1} ${data.temperature}°C\n湿度: ${data.humidity}%\n风向: ${data.windDirection} ${data.windScale}`;
        } else {
            throw new Error('天气数据获取失败');
        }
    } catch (error) {
        console.error('获取天气数据时出错:', error);
        return '数据获取失败';
    }
}

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

// 更新博客内容的函数
async function updateBlogContent() {
    const currentDate = new Date();
    const weatherData = await getWeatherData();
    
    const weatherLines = weatherData.split('\n');
    const [weather, humidity, wind] = weatherLines;
    return {
        title: `今日天气：${weather}`,
        date: formatDateTime(currentDate),
        isSticky: true,
        content: `
<div class="weather-info">
    <h3>📅 实时天气信息</h3>
    <p>🕒 当前时间：<span id="dynamic-time">${formatDateTime(currentDate)}</span></p>
    <p>🌤️ 天气状况：${weather}</p>
    <p>💧 ${humidity}</p>
    <p>🌪️ ${wind}</p>
</div>

<details>
    <summary>📝 今日小记</summary>
    <ul style="list-style: none; padding-left: 10px;">
        <li>🌤️ <strong>天气</strong>: ${weather}</li>
        <li>💧 <strong>湿度</strong>: ${humidity}</li>
        <li>🌪️ <strong>风况</strong>: ${wind}</li>
        <li>💭 <strong>心情</strong>: 轻松愉快</li>
        <li>✨ <strong>感想</strong>: 这样的好天气总让人心情愉悦，忍不住想要出门散步，感受大自然的美好。</li>
    </ul>
</details>`
    };
}

// 获取默认博客数据的函数
async function getDefaultBlogs() {
    try {
        // 检查localStorage中是否已有博客数据
        const existingBlogs = localStorage.getItem('blogs');
        if (existingBlogs) {
            // 如果已有数据，对数据进行排序后返回
            const blogs = JSON.parse(existingBlogs);
            // 确保每个博客都有唯一ID
            blogs.forEach((blog, index) => {
                if (!blog.id) {
                    blog.id = `blog-${Date.now()}-${index}`;
                }
            });
            return blogs.sort((a, b) => (b.isSticky || false) - (a.isSticky || false));
        }
        
        // 只有在没有现有数据时，才创建默认博客
        const weatherBlog = await updateBlogContent();
        return [
            weatherBlog
        ];
    } catch (error) {
        console.error('获取默认博客数据时出错:', error);
        // 返回一个简单的默认博客，以防出错
        return [{
            title: "博客加载中...",
            date: new Date().toLocaleString(),
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

// 将函数暴露为全局变量，以便在非模块环境中使用
window.getDefaultBlogs = getDefaultBlogs;
window.updateBlogContent = updateBlogContent;
window.startDynamicTimeUpdate = startDynamicTimeUpdate;