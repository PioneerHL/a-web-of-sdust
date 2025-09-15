// 山东科技大学交通学院智能体"交好运" - JavaScript实现

/**
 * 交通学院智能体类
 */
class JiaoHaoYunAI {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.messageHistory = [];
        this.isTyping = false;
        this.initializeChat();
    }

    // 初始化DOM元素
    initializeElements() {
        // 聊天相关元素
        this.chatContainer = document.getElementById('chat-container');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.quickQuestions = document.querySelectorAll('.quick-question');
        this.menuToggle = document.getElementById('menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navbar = document.getElementById('navbar');
        
        // 作业批改相关元素
        this.uploadArea = document.getElementById('upload-area');
        this.fileUpload = document.getElementById('file-upload');
        
        // FAQ相关元素
        this.faqToggles = document.querySelectorAll('.faq-toggle');
    }

    // 绑定事件
    bindEvents() {
        // 聊天事件
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // 快捷问题事件
        this.quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.textContent;
                this.userInput.value = question;
                this.sendMessage();
            });
        });
        
        // 移动端菜单事件
        if (this.menuToggle && this.mobileMenu) {
            this.menuToggle.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('hidden');
            });
        }
        
        // 导航栏滚动事件
        window.addEventListener('scroll', () => this.handleNavbarScroll());
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // 关闭移动菜单
                    if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
                        this.mobileMenu.classList.add('hidden');
                    }
                }
            }.bind(this));
        });
        
        // FAQ切换事件
        if (this.faqToggles) {
            this.faqToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const target = document.getElementById(toggle.dataset.target);
                    if (target) {
                        target.classList.toggle('hidden');
                        const icon = toggle.querySelector('i');
                        if (icon) {
                            icon.style.transform = target.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                        }
                    }
                });
            });
        }
        
        // 作业上传事件
        if (this.uploadArea && this.fileUpload) {
            this.uploadArea.addEventListener('click', () => this.fileUpload.click());
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('border-primary');
            });
            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.classList.remove('border-primary');
            });
            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('border-primary');
                if (e.dataTransfer.files.length) {
                    this.handleFileUpload(e.dataTransfer.files[0]);
                }
            });
            this.fileUpload.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }
        
        // 数字增长动画
        this.initializeCounterAnimation();
    }

    // 初始化聊天界面
    initializeChat() {
        this.addAIMessage('你好！我是"交好运"智能助手，很高兴为你服务。我可以帮你解答关于山东科技大学交通学院的各种问题，包括课程信息、作业辅导、学院政策等。请问有什么可以帮助你的吗？');
    }

    // 处理导航栏滚动效果
    handleNavbarScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('bg-white', 'shadow-md');
            this.navbar.classList.remove('bg-transparent');
        } else {
            this.navbar.classList.remove('bg-white', 'shadow-md');
            this.navbar.classList.add('bg-transparent');
        }
    }

    // 发送消息
    sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isTyping) return;
        
        // 添加用户消息
        this.addUserMessage(message);
        
        // 清空输入框
        this.userInput.value = '';
        
        // 处理AI回复
        this.processAIResponse(message);
    }

    // 添加用户消息
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'flex mb-4 items-start justify-end';
        messageElement.innerHTML = `
            <div class="bg-primary text-white rounded-2xl p-4 max-w-[80%]">
                <p>${this.escapeHTML(message)}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-3">
                <i class="fa fa-user text-gray-600"></i>
            </div>
        `;
        this.chatContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // 保存到消息历史
        this.messageHistory.push({ type: 'user', content: message });
    }

    // 添加AI消息
    addAIMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'flex mb-4 items-start';
        messageElement.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3">
                <i class="fa fa-robot text-primary"></i>
            </div>
            <div class="bg-secondary rounded-2xl p-4 max-w-[80%]">
                <p>${this.escapeHTML(message)}</p>
            </div>
        `;
        this.chatContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // 保存到消息历史
        this.messageHistory.push({ type: 'ai', content: message });
    }

    // 添加正在输入指示器
    addTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'flex mb-4 items-start';
        typingElement.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3">
                <i class="fa fa-robot text-primary"></i>
            </div>
            <div class="bg-secondary rounded-2xl p-4">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        this.chatContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    // 移除正在输入指示器
    removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
        this.isTyping = false;
    }

    // 处理AI回复
    processAIResponse(userMessage) {
        this.addTypingIndicator();
        
        // 模拟思考时间
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(userMessage);
            this.addAIMessage(response);
        }, 1500);
    }

    // 生成AI回复
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // 课程相关问题
        if (message.includes('课程表') || message.includes('课表')) {
            return '你可以通过以下方式查询课程表：1) 登录学校教务系统，在"我的课程"模块查看；2) 关注"山科大交通学院"微信公众号，点击"学生服务"-"课程表查询"；3) 前往学院教学办公室咨询。如需具体课程信息，也可以直接告诉我你想了解的课程名称。';
        }
        
        if (message.includes('考试') || message.includes('考核')) {
            return '考试安排一般会在考试前两周通过教务系统和班级通知发布。如果你想了解具体科目的考试信息，可以告诉我课程名称，我会尽力为你提供相关信息。此外，你也可以关注学院公告栏或咨询辅导员获取最新的考试安排。';
        }
        
        // 作业批改相关问题
        if (message.includes('作业批改') || message.includes('批改作业')) {
            return '"交好运"智能体支持多种类型的作业批改。你可以在页面下方的"智能作业批改系统"区域上传作业文件，选择作业类型和批改模式，系统会根据你的设置进行智能批改并提供详细的反馈和分析报告。目前支持选择题、填空题、简答题等多种题型的批改。';
        }
        
        // 学院介绍相关问题
        if (message.includes('学院') && (message.includes('介绍') || message.includes('历史'))) {
            return '山东科技大学交通学院创建于1985年，经过多年的发展，已成为我国交通领域重要的人才培养和科学研究基地。学院设有交通工程、交通运输、车辆工程、物流工程等多个本科专业，并拥有交通运输工程一级学科硕士点和博士点。学院师资力量雄厚，现有教职工120余人，其中教授25人，副教授40人。';
        }
        
        if (message.includes('专业') || message.includes('学科')) {
            return '山东科技大学交通学院目前设有交通工程、交通运输、车辆工程、物流工程四个本科专业，拥有交通运输工程一级学科硕士点和博士点。其中，交通运输工程为山东省重点学科。学院还拥有多个国家级和省部级科研平台，为学生提供了良好的学习和科研环境。';
        }
        
        // 学术活动相关问题
        if (message.includes('学术') || message.includes('讲座') || message.includes('活动')) {
            return '学院定期举办各类学术活动，包括学术讲座、研讨会、论坛等。近期活动可以通过以下方式查询：1) 学院官方网站"学术活动"栏目；2) 学院微信公众号；3) 教学楼公告栏。你也可以告诉我你感兴趣的研究方向，我可以为你推荐相关的学术活动。';
        }
        
        // 培养方案相关问题
        if (message.includes('培养方案') || message.includes('教学计划')) {
            return '各专业的培养方案可以在学院官网"人才培养"栏目下载查看，也可以向辅导员或教学秘书咨询。培养方案包含了专业培养目标、毕业要求、课程设置、学分要求等重要信息，是你大学学习的重要参考文件。如有具体课程选择或学习规划方面的问题，也可以随时向我咨询。';
        }
        
        // 常见问题
        if (message.includes('你是谁') || message.includes('什么') || message.includes('名字')) {
            return '我是"交好运"智能助手，是山东科技大学交通学院为师生打造的智能服务平台。我可以为你提供课程咨询、作业辅导、学院政策解答、学术活动查询等服务。';
        }
        
        if (message.includes('谢谢') || message.includes('感谢')) {
            return '不客气！这是我应该做的。如果你还有其他问题，随时都可以问我。';
        }
        
        // 默认回复
        return '感谢你的提问！我是"交好运"智能助手，目前正在不断学习和进步中。对于你提出的问题，我还需要进一步学习和完善。你可以尝试用其他方式描述你的问题，或者直接咨询学院相关部门获取更准确的信息。';
    }

    // 滚动到底部
    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    // 转义HTML特殊字符
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 初始化数字增长动画
    initializeCounterAnimation() {
        const counters = document.querySelectorAll('.counter-item [data-count]');
        if (!counters.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    this.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // 数字增长动画
    animateCounter(element, target) {
        let count = 0;
        const duration = 2000; // 动画持续时间（毫秒）
        const increment = target / (duration / 16); // 每16ms增加的数值
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(timer);
                count = target;
            }
            
            // 根据目标值决定显示格式
            if (target >= 1000) {
                element.textContent = Math.floor(count / 100) / 10 + 'k';
            } else {
                element.textContent = Math.floor(count);
            }
        }, 16);
    }

    // 处理文件上传
    handleFileUpload(file) {
        // 这里可以实现文件上传的逻辑
        console.log('上传文件:', file);
        
        // 模拟上传成功提示
        alert(`文件"${file.name}"上传成功！在实际应用中，这里会将文件发送到服务器进行处理。`);
        
        // 在实际应用中，这里可以显示文件预览
        // this.showFilePreview(file);
    }

    // 显示文件预览（实际应用中可以实现）
    showFilePreview(file) {
        // 实现文件预览逻辑
    }
}

// 页面加载完成后初始化智能体
document.addEventListener('DOMContentLoaded', () => {
    // 初始化交通学院智能体
    const jiaohaoiyun = new JiaoHaoYunAI();
    
    // 添加页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // 导航栏高亮当前页面
    const highlightNavbar = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-primary');
            link.classList.add('text-dark');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.remove('text-dark');
                link.classList.add('text-primary');
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavbar);
    highlightNavbar(); // 初始化时执行一次
});

/**
 * 工具函数：获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
function getURLParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * 工具函数：防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * 工具函数：节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}