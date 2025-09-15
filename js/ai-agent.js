// AI智能体"小科"功能实现（优化版）

class AIAgent {
    constructor() {
        this.name = '小科';
        this.isActive = false;
        this.chatWindow = null;
        this.messageList = null;
        this.inputField = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.typingIndicator = null;
        this.messageHistory = []; // 存储聊天历史
        this.initialize();
    }

    initialize() {
        // 创建AI智能体界面元素
        this.createUI();

        // 绑定事件
        this.bindEvents();
    }

    createUI() {
        // 创建切换按钮
        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'ai-toggle-btn';
        this.toggleButton.className = 'fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all transform hover:scale-110 focus:outline-none';
        this.toggleButton.innerHTML = '<i class="fa fa-comments text-xl"></i>';
        document.body.appendChild(this.toggleButton);

        // 创建聊天窗口
        this.chatWindow = document.createElement('div');
        this.chatWindow.id = 'ai-chat-window';
        this.chatWindow.className = 'fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 hidden flex flex-col transform transition-all duration-300 scale-95 opacity-0';

        // 聊天窗口头部
        const chatHeader = document.createElement('div');
        chatHeader.className = 'bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between';
        chatHeader.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <i class="fa fa-robot text-white"></i>
                </div>
                <h3 class="font-bold text-lg">${this.name}</h3>
            </div>
            <button id="ai-close-btn" class="text-white hover:text-gray-200 focus:outline-none">
                <i class="fa fa-times"></i>
            </button>
        `;
        this.chatWindow.appendChild(chatHeader);

        // 聊天消息列表
        this.messageList = document.createElement('div');
        this.messageList.id = 'ai-message-list';
        this.messageList.className = 'flex-1 p-4 overflow-y-auto';
        this.chatWindow.appendChild(this.messageList);

        // 正在输入指示器
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.id = 'ai-typing-indicator';
        this.typingIndicator.className = 'mb-4 text-left hidden';
        this.typingIndicator.innerHTML = `
            <div class="inline-block max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 text-dark">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
        this.chatWindow.appendChild(this.typingIndicator);

        // 快捷问题区域
        const quickQuestions = document.createElement('div');
        quickQuestions.className = 'p-3 border-t bg-gray-50';
        quickQuestions.innerHTML = `
            <p class="text-xs text-gray-500 mb-2">快速提问:</p>
            <div class="flex flex-wrap gap-2">
                <button class="ai-quick-question px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">课程设置</button>
                <button class="ai-quick-question px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">入学要求</button>
                <button class="ai-quick-question px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">校园设施</button>
            </div>
        `;
        this.chatWindow.appendChild(quickQuestions);

        // 聊天输入区域
        const inputContainer = document.createElement('div');
        inputContainer.className = 'p-4 border-t';
        inputContainer.innerHTML = `
            <div class="flex space-x-2">
                <input type="text" id="ai-input" placeholder="请输入您的问题..." class="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                <button id="ai-send-btn" class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                    <i class="fa fa-paper-plane"></i>
                </button>
            </div>
        `;
        this.chatWindow.appendChild(inputContainer);

        document.body.appendChild(this.chatWindow);

        // 获取输入框和发送按钮
        this.inputField = document.getElementById('ai-input');
        this.sendButton = document.getElementById('ai-send-btn');
        this.closeButton = document.getElementById('ai-close-btn');

        // 初始欢迎消息
        this.addMessage('system', '您好！我是小科，波中教育集团的AI助手。我可以为您提供课程咨询、入学申请、校园设施等信息。有什么可以帮助您的吗？');
    }

    bindEvents() {
        // 切换聊天窗口显示/隐藏
        this.toggleButton.addEventListener('click', () => {
            this.toggleChatWindow();
        });

        // 关闭聊天窗口
        this.closeButton.addEventListener('click', () => {
            this.hideChatWindow();
        });

        // 发送消息
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // 按Enter键发送消息
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 快捷问题按钮点击事件
        document.querySelectorAll('.ai-quick-question').forEach(button => {
            button.addEventListener('click', () => {
                const question = button.textContent;
                this.inputField.value = question;
                this.sendMessage();
            });
        });
    }

    toggleChatWindow() {
        if (this.isActive) {
            this.hideChatWindow();
        } else {
            this.showChatWindow();
        }
    }

    showChatWindow() {
        this.chatWindow.classList.remove('hidden');
        setTimeout(() => {
            this.chatWindow.classList.remove('scale-95', 'opacity-0');
            this.chatWindow.classList.add('scale-100', 'opacity-100');
        }, 10);
        this.isActive = true;
        this.toggleButton.innerHTML = '<i class="fa fa-times text-xl"></i>';
        this.inputField.focus();
    }

    hideChatWindow() {
        this.chatWindow.classList.remove('scale-100', 'opacity-100');
        this.chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            this.chatWindow.classList.add('hidden');
        }, 300);
        this.isActive = false;
        this.toggleButton.innerHTML = '<i class="fa fa-comments text-xl"></i>';
    }

    sendMessage() {
        const message = this.inputField.value.trim();
        if (message) {
            // 添加用户消息
            this.addMessage('user', message);
            this.messageHistory.push({sender: 'user', content: message});
            this.inputField.value = '';

            // 显示正在输入指示器
            this.typingIndicator.classList.remove('hidden');

            // 模拟AI思考过程，随机延迟1-3秒
            const thinkDelay = Math.floor(Math.random() * 2000) + 1000;
            setTimeout(() => {
                this.generateResponse(message);
                // 隐藏正在输入指示器
                this.typingIndicator.classList.add('hidden');
            }, thinkDelay);
        }
    }

    addMessage(sender, content) {
        const messageElement = document.createElement('div');
        messageElement.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'} animate-fadeIn`;

        const contentElement = document.createElement('div');
        contentElement.className = `inline-block max-w-[80%] px-4 py-3 rounded-lg ${sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-dark'} shadow-sm`;

        // 支持简单的富文本
        if (content.includes('\n')) {
            contentElement.innerHTML = content.replace(/\n/g, '<br>');
        } else {
            contentElement.textContent = content;
        }

        messageElement.appendChild(contentElement);
        this.messageList.appendChild(messageElement);

        // 滚动到底部
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    // 分析用户输入，生成更智能的回复
    generateResponse(userMessage) {
        // 转换为小写以便于匹配
        const lowerMessage = userMessage.toLowerCase();
        let response = '抱歉，我不太理解您的问题。您可以尝试询问关于课程设置、入学要求、校园设施等方面的问题，我会尽力为您解答。';

        // 更智能的匹配逻辑：考虑上下文和更复杂的关键词组合
        if (this.matchIntent(lowerMessage, ['你好', '嗨', '您好', '早上好', '晚上好', '下午好'])) {
            const greetings = [
                '您好！很高兴为您服务。我是小科，波中教育集团的AI助手。',
                '嗨！我是小科，有什么可以帮到您的吗？',
                '您好！欢迎咨询波中教育集团。我能为您提供什么帮助？'
            ];
            response = greetings[Math.floor(Math.random() * greetings.length)];
        } 
        else if (this.matchIntent(lowerMessage, ['课程', '教育项目', '学习内容', '教学计划'])) {
            response = '波中教育集团提供从幼儿园到大学预科的完整教育体系。\n\n国际课程包括：\n- A-Level（英国高中课程）\n- IB（国际文凭课程）\n- AP（美国大学先修课程）\n\n此外，我们还提供丰富的课外活动和实践项目。您对哪个阶段或类型的课程感兴趣？';
        } 
        else if (this.matchIntent(lowerMessage, ['学费', '费用', '价格', '收费标准'])) {
            response = '我们的学费因课程类型、年级和学制而异。\n\n例如：\n- 国际小学：每年8-10万元\n- 国际初中：每年10-12万元\n- 国际高中（A-Level/IB/AP）：每年15-20万元\n\n具体费用请访问我们的官方网站或联系招生顾问获取最新信息。';
        } 
        else if (this.matchIntent(lowerMessage, ['报名', '申请', '入学', '录取'])) {
            response = '报名流程如下：\n1. 提交申请材料（申请表、成绩单、语言成绩等）\n2. 参加入学测试和面试\n3. 收到录取通知书\n4. 缴纳学费确认学位\n\n您可以通过我们的官方网站在线报名，或前往学校招生办公室提交申请材料。如有疑问，欢迎咨询我们的招生顾问。';
        } 
        else if (this.matchIntent(lowerMessage, ['地址', '位置', '在哪里', '怎么去'])) {
            response = '我们的主校区位于北京市朝阳区久文路宇达创意中心。\n\n交通指南：\n- 地铁：乘坐10号线到国贸站，换乘8号线到瀛海站，再乘坐公交526路到久文路站下车。\n- 公交：乘坐526路、341路、453路到久文路站下车。\n- 自驾：导航至"北京市朝阳区久文路宇达创意中心"。\n\n欢迎您前来参观！';
        } 
        else if (this.matchIntent(lowerMessage, ['师资', '老师', '教师', '教学团队'])) {
            response = '我们拥有一支高素质的国际化教师团队：\n- 80%以上拥有硕士及以上学位\n- 50%以上拥有海外教育背景\n- 平均教学经验8年以上\n- 来自全球20多个国家和地区\n\n教师团队定期参加专业培训，确保教学质量与国际接轨。';
        } 
        else if (this.matchIntent(lowerMessage, ['毕业', '升学', '录取率', '去向'])) {
            response = '波中教育集团的毕业生升学率达98%，其中：\n- 60%以上被世界排名前100的大学录取\n- 30%以上被世界排名前50的大学录取\n- 10%以上被世界排名前20的大学录取\n\n热门去向包括哈佛大学、耶鲁大学、牛津大学、剑桥大学、麻省理工学院等世界顶尖名校。';
        } 
        else if (this.matchIntent(lowerMessage, ['校园设施', '环境', '宿舍', '食堂'])) {
            response = '我们的校园设施一流：\n- 现代化教学楼和实验室\n- 藏书丰富的图书馆\n- 标准足球场、篮球场、游泳池\n- 艺术中心和音乐室\n- 舒适的学生宿舍（单人间/双人间）\n- 多样化餐厅（中、西、日等多种 cuisine）\n\n校园环境优美，绿化率达40%以上，为学生提供良好的学习和生活环境。';
        } 
        else if (this.matchIntent(lowerMessage, ['你是谁', '什么是小科', '介绍一下你自己'])) {
            response = '我是小科，波中教育集团的AI助手。我的主要职责是为您提供关于学校、课程、招生等方面的信息和帮助。\n\n我可以回答您的问题、提供相关资讯，甚至帮助您预约参观校园或咨询招生顾问。\n\n如果您有任何疑问，请随时问我！';
        } 
        else if (this.matchIntent(lowerMessage, ['谢谢', '感谢', '非常感谢'])) {
            const thanksResponses = [
                '不客气！如果您还有其他问题，随时都可以问我。',
                '很高兴能帮到您！有任何需要，请随时联系我。',
                '不用谢！波中教育集团竭诚为您服务。'
            ];
            response = thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
        } 
        else if (this.matchIntent(lowerMessage, ['入学要求', '申请条件', '需要什么材料'])) {
            response = '不同阶段的入学要求有所不同：\n\n国际小学：\n- 年满6周岁\n- 提供原校成绩单\n- 面试评估\n\n国际初中：\n- 完成小学学业\n- 提供原校成绩单\n- 英语水平测试\n- 面试\n\n国际高中：\n- 完成初中学业\n- 提供原校成绩单\n- 雅思/托福成绩\n- 入学考试\n- 面试\n\n具体要求请访问我们的官方网站或联系招生顾问。';
        }

        // 添加AI回复
        this.addMessage('ai', response);
        this.messageHistory.push({sender: 'ai', content: response});
    }

    // 匹配用户意图的辅助函数
    matchIntent(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
}

// 等待DOM加载完成后初始化AI智能体
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保页面其他元素已加载完成
    setTimeout(() => {
        const aiAgent = new AIAgent();
    }, 1000);
});