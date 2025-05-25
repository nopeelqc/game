let selectedCharacter = null;
let health = 100; // Percentage-based for UI
let maxHealth = 1000; // Actual max HP based on character
let currentHealth = maxHealth; // Actual current HP
let skillCooldowns = [0, 0, 0, 0];
let cooldownDurations = [0, 0, 0, 0];
let enemies = [];
let cultivatorForm = 'melee';
let cultivatorSkills = [];
let isPaused = false;
let activeEffects = [];
let currentTurn = 1;
let damageTexts = [];
let lastUpdateTime = 0;

// Player DOM element and position
let playerElement = null;
let playerX, playerY;
let playerSize = 70;
let playerSpeed = 5;

// DOM-based enemy container
let enemyContainer = null;

// Cache DOM elements to reduce querySelector calls
const domCache = {
    mainMenu: null,
    characterSelect: null,
    gamePlay: null,
    avatar: null,
    health: null,
    bossName1: null,
    bossName2: null,
    bossHealth1: null,
    bossHealth2: null,
    bossEffects1: null,
    bossEffects2: null,
    playerEffects: null,
    skillButtons: [],
    pauseModal: null,
    skillModal: null,
    guideModal: null,
    enemyContainer: null // Container for enemies
};

const effectImages = {
    'giảm thương': 'giamthuong.png',
    'tăng thương': 'tangthuong.png',
    'tăng tốc đánh': 'tangtocdanh.png',
    'hồi máu': 'hoimau.png',
    'tăng tốc chạy': 'tocchay.png',
    'làm chậm': 'lamcham.png',
    'khóa kỹ năng': 'khoakinang.png',
    'choáng': 'choang.png',
    'thiêu đốt': 'thieudot.png',
    'bùng cháy': 'bungchay.png',
    'đóng băng': 'dongbang.png',
    'mưa băng': 'muabang.png',
    'cuồng phong': 'cuongphong.png',
    'vụt lốc': 'vutloc.png',
    'huyết hải': 'huyethai.png',
    'huyết tế': 'huyette.png',
    'gọi anh em': 'goianhem.png',
    'phím thủ': 'phimthu.png',
    'đập đất': 'dapdat.png',
    'khiên đất': 'khiendat.png',
    'lôi kiếp': 'loikiep.png',
    'uy áp': 'uyap.png',
    'trói buộc': 'troibuoc.png',
    'nhất khí hóa tam thanh': 'nhatkhihoatamthanh.png',
    'đạn lửa': 'danlua.png',
    'khiên plasma': 'khienplasma.png',
    'bão từ': 'baotu.png',
    'drone hỗ trợ': 'dronehotro.png',
    'gươm thiên địa': 'guomthiendia.png',
    'quang cầu': 'quangcau.png',
    'cánh sa ngã': 'canhsanga.png',
    'thiên giới trói buộc': 'thiengioitroibuoc.png'
};

const debuffEffects = ['giảm thương', 'làm chậm', 'khóa kỹ năng', 'choáng', 'thiêu đốt', 'đóng băng', 'cuồng phong', 'huyết tế', 'phím thủ', 'trói buộc', 'bão từ', 'cánh sa ngã', 'thiên giới trói buộc'];

const bossSkills = {
    'fireBoss': [
        { name: 'Thiêu Đốt', effect: 'thiêu đốt', duration: 5, cooldown: 10 },
        { name: 'Bùng Cháy', effect: 'bùng cháy', duration: 0.1, cooldown: 12 }
    ],
    'iceBoss': [
        { name: 'Đóng Băng', effect: 'đóng băng', duration: 8, cooldown: 8 },
        { name: 'Mưa Băng', effect: 'mưa băng', duration: 0.1, cooldown: 10 }
    ],
    'tienBoss': [
        { name: 'Cuồng Phong', effect: 'cuồng phong', duration: 0.1, cooldown: 9 },
        { name: 'Vụt Lốc', effect: 'vụt lốc', duration: 0.1, cooldown: 12 }
    ],
    'maBoss': [
        { name: 'Huyết Hải', effect: 'huyết hải', duration: 0.1, cooldown: 9 },
        { name: 'Huyết Tế', effect: 'huyết tế', duration: 2, cooldown: 12 }
    ],
    'giangHoMangBoss': [
        { name: 'Gọi Anh Em', effect: 'gọi anh em', duration: 0.1, cooldown: 10 },
        { name: 'Phím Thủ', effect: 'phím thủ', duration: 8, cooldown: 8 }
    ],
    'khongLoBoss': [
        { name: 'Đập Đất', effect: 'đập đất', duration: 0.1, cooldown: 10 },
        { name: 'Khiên Đất', effect: 'khiên đất', duration: 5, cooldown: 12 }
    ],
    'thienDaoBoss': [
        { name: 'Lôi Kiếp', effect: 'lôi kiếp', duration: 0.1, cooldown: 10 },
        { name: 'Uy Áp', effect: 'uy áp', duration: 2, cooldown: 12 },
        { name: 'Trói Buộc', effect: 'trói buộc', duration: 10, cooldown: 10 },
        { name: 'Nhất Khí Hóa Tam Thanh', effect: 'nhất khí hóa tam thanh', duration: 0.1, cooldown: 15 }
    ],
    'coGiBoss': [
        { name: 'Đạn Lửa', effect: 'đạn lửa', duration: 5, cooldown: 8 },
        { name: 'Khiên Plasma', effect: 'khiên plasma', duration: 12, cooldown: 12 },
        { name: 'Bão Từ', effect: 'bão từ', duration: 4.5, cooldown: 10 },
        { name: 'Drone Hỗ Trợ', effect: 'drone hỗ trợ', duration: 15, cooldown: 15 }
    ],
    'thienThanSaNgaBoss': [
        { name: 'Gươm Thiên Địa', effect: 'gươm thiên địa', duration: 0.1, cooldown: 10 },
        { name: 'Quang Cầu', effect: 'quang cầu', duration: 5, cooldown: 12 },
        { name: 'Cánh Sa Ngã', effect: 'cánh sa ngã', duration: 10, cooldown: 10 },
        { name: 'Thiên Giới Trói Buộc', effect: 'thiên giới trói buộc', duration: 3, cooldown: 15 }
    ]
};

const characterData = {
    knight: {
        name: "Kỵ Sĩ",
        type: "Phong cách Châu Âu",
        stats: { "Máu:": "1200 HP", "Sát thương:": "95", "Tốc đánh:": "1.2 đòn/s", "DPS:": "96", "Loại:": "Tanker, Cận chiến" },
        story: "Công chúa bị quỷ bắt, vương quốc giao nhiệm vụ",
        ending: "Cầu hôn tại lễ hội ánh sáng",
        maxHealth: 1200,
        attack: 95,
        attackSpeed: 1.2,
        skills: [
            { name: "Thánh Khiên", desc: "Giảm 50% sát thương nhận vào trong 3 giây", cooldown: 10, effect: 'giảm thương', image: "skill1.png", duration: 3 },
            { name: "Hào Quang Chiến Binh", desc: "Hồi 150 HP tức thì", cooldown: 12, effect: 'hồi máu', image: "skill2.png", duration: 0.1 },
            { name: "Chém Nghiền Nát", desc: "Tăng 30% sát thương trong 5 giây", cooldown: 10, effect: 'tăng thương', image: "skill3.png", duration: 5 },
            { name: "Cuồng Kích", desc: "Tăng tốc đánh 40% trong 4 giây", cooldown: 12, effect: 'tăng tốc đánh', image: "skill4.png", duration: 4 }
        ],
        avatar: "imageknighttachnen.png"
    },
    cultivator: {
        name: "Thánh Tử",
        type: "Phong cách Tu Tiên",
        stats: { "Máu (Cận):": "650 HP", "Máu (Xa):": "750 HP", "ST (Cận):": "100", "ST (Xa):": "75 AOE", "Loại:": "Linh hoạt, Đa năng" },
        story: "Thánh nữ sở hữu thiên phú cao, lúc độ kiếp với thiên đạo bị tiên ma tính kế",
        ending: "Cùng tu tiên quy ẩn nơi tiên cảnh",
        maxHealthMelee: 650,
        maxHealthRanged: 750,
        attackMelee: 100,
        attackRanged: 75,
        attackSpeed: 1.5,
        skills: [
            { name: "Thức Tỉnh Linh Thể", desc: "Chuyển đổi giữa cận ↔ xa (0.5s delay)", cooldown: 20, effect: '', image: "skill5.png", duration: 0 },
            { name: "Kiếm Vũ Linh Hồn", desc: "Tăng 30% sát thương cận trong 5s", cooldown: 10, effect: 'tăng thương', image: "skill6.png", duration: 5 },
            { name: "Lôi Kiếm Trận", desc: "Triệu hồi kiếm trận gây 50 sát thương/s trong 4s", cooldown: 14, effect: '', image: "skill10.png", duration: 0 },
            { name: "Kiếm Hút Hồn", desc: "Hồi 10% máu theo damage gây ra (5s hiệu lực)", cooldown: 12, effect: 'hồi máu', image: "skill7.png", duration: 5 },
            { name: "Hư Không Tốc Bộ", desc: "Tăng tốc chạy 50% trong 3s", cooldown: 10, effect: 'tăng tốc chạy', image: "skill9.png", duration: 3 },
            { name: "Linh Kiếm Trảm", desc: "Gây 150 sát thương cận, làm choáng 1s", cooldown: 15, effect: 'choáng', image: "skill8.png", duration: 1 },
            { name: "Tốc Kiếm Pháp", desc: "Tăng tốc đánh 40% trong 5s", cooldown: 10, effect: 'tăng tốc đánh', image: "skill11.png", duration: 5 }
        ],
        avatar: "imagethanhtutachnen.png"
    },
    soldier: {
        name: "Đặc Binh",
        type: "Phong cách Hiện Đại",
        stats: { "Máu:": "800 HP", "Sát thương:": "120", "Tốc đánh:": "2 đòn/s", "DPS:": "240", "Loại:": "Đánh xa, ST cao" },
        story: "Đại minh tinh số 1 ngành giải trí bị bắt cóc, được thuê về để giải cứu",
        ending: "Giải cứu, kết hôn và ẩn danh",
        maxHealth: 800,
        attack: 120,
        attackSpeed: 2,
        skills: [
            { name: "Nội Tại Tập Kích", desc: "Tăng 50% sát thương trong 4 giây", cooldown: 10, effect: 'tăng thương', image: "skill12.png", duration: 4 },
            { name: "Bọc Thép Chiến Thuật", desc: "Tăng 200 máu tạm thời trong 5 giây", cooldown: 12, effect: '', image: "skill13.png", duration: 0 },
            { name: "Đạn Xuyên Phá", desc: "+30% dame + làm chậm địch 3 giây", cooldown: 10, effect: 'làm chậm', image: "skill14.png", duration: 3 },
            { name: "Tiếp Đạn Nhanh", desc: "Tăng tốc đánh 50% trong 4 giây", cooldown: 10, effect: 'tăng tốc đánh', image: "skill15.png", duration: 4 }
        ],
        avatar: "imagebinhchungtachnen.png"
    },
    regularMonster: { avatar: "quaithuong.png", attack: 45, attackSpeed: 1 },
    fireBoss: { avatar: "bosslua.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8 },
    iceBoss: { avatar: "bossbang.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8 },
    tienBoss: { avatar: "bosstien.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8 },
    maBoss: { avatar: "bossma.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8 },
    giangHoMangBoss: { avatar: "bossgianghomang.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8 },
    khongLoBoss: { avatar: "bosskhonglo.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8 },
    thienDaoBoss: { avatar: "thiendao.png", maxHealth: 7000, attack: 180, attackSpeed: 1.2 },
    coGiBoss: { avatar: "sieucogioi.png", maxHealth: 7000, attack: 180, attackSpeed: 1.2 },
    thienThanSaNgaBoss: { avatar: "thienthansanga.png", maxHealth: 7000, attack: 180, attackSpeed: 1.2 }
};

const regularBossTypes = ['fireBoss', 'iceBoss', 'tienBoss', 'maBoss', 'giangHoMangBoss', 'khongLoBoss'];
const superBossTypes = ['thienDaoBoss', 'coGiBoss', 'thienThanSaNgaBoss'];

function initDomCache() {
    domCache.mainMenu = document.getElementById('mainMenu');
    domCache.characterSelect = document.getElementById('characterSelect');
    domCache.gamePlay = document.getElementById('gamePlay');
    domCache.avatar = document.getElementById('avatar');
    domCache.health = document.getElementById('health');
    domCache.bossName1 = document.getElementById('bossName1');
    domCache.bossName2 = document.getElementById('bossName2');
    domCache.bossHealth1 = document.getElementById('bossHealth1');
    domCache.bossHealth2 = document.getElementById('bossHealth2');
    domCache.bossEffects1 = document.getElementById('bossEffects1');
    domCache.bossEffects2 = document.getElementById('bossEffects2');
    domCache.playerEffects = document.getElementById('playerEffects');
    domCache.skillButtons = [
        document.getElementById('skill1'),
        document.getElementById('skill2'),
        document.getElementById('skill3'),
        document.getElementById('skill4')
    ];
    domCache.pauseModal = document.getElementById('pauseModal');
    domCache.skillModal = document.getElementById('skillModal');
    domCache.guideModal = document.getElementById('guideModal');
    // Create a new container for enemies
    let enemyContainer = document.getElementById('enemy-container');
    if (!enemyContainer) {
        enemyContainer = document.createElement('div');
        enemyContainer.id = 'enemy-container';
        enemyContainer.style.position = 'absolute';
        enemyContainer.style.top = '0';
        enemyContainer.style.left = '0';
        enemyContainer.style.width = '100vw';
        enemyContainer.style.height = '100vh';
        enemyContainer.style.pointerEvents = 'none'; // Prevent interference with UI
        enemyContainer.style.zIndex = '10';
        document.body.appendChild(enemyContainer);
    }
    domCache.enemyContainer = enemyContainer;
}

function showCharacterSelect() {
    domCache.mainMenu.style.display = 'none';
    domCache.characterSelect.style.display = 'block';
    createParticles();
}

function showMainMenu() {
    domCache.characterSelect.style.display = 'none';
    domCache.mainMenu.style.display = 'flex';
    selectedCharacter = null;
    updateStartButton();
}

function showDonate() {
    alert('💎 Cảm ơn bạn đã muốn ủng hộ! Tính năng donate sẽ được cập nhật sớm.');
}

function showContribute() {
    alert('🤝 Cảm ơn bạn muốn đóng góp! Hãy liên hệ với chúng tôi qua email: luongquoccuongvtvp@gmail.com');
}

function showGuide() {
    domCache.guideModal.style.display = 'block';
    const guideContent = domCache.guideModal.querySelector('#guideContent');
    guideContent.innerHTML = `
        <h2>📖 Hướng Dẫn</h2>
        <p>⚔️ **W, A, S, D**: Di chuyển theo thứ tự trên, trái, xuống, phải</p>
        <p>⚔️ **J**: Đánh thường</p>
        <p>⚔️ **U, I, O, P**: Kỹ năng 1, 2, 3, 4</p>
    `;
}

function closeGuide() {
    domCache.guideModal.style.display = 'none';
}

function exitGame() {
    if (confirm('🚪 Bạn có chắc chắn muốn thoát game không?')) {
        window.close();
    }
}

function selectCharacter(characterType) {
    document.querySelectorAll('.character-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-character="${characterType}"]`).classList.add('selected');
    selectedCharacter = characterType;
    updateStartButton();
}

function updateStartButton() {
    const startBtn = document.getElementById('startGameBtn');
    startBtn.style.display = selectedCharacter ? 'block' : 'none';
}

function showSkillDetails(characterType) {
    const character = characterData[characterType];
    const content = domCache.skillModal.querySelector('#skillContent');
    let skillsHtml = `
        <h2>📋 Chi tiết nhân vật: ${character.name}</h2>
        <p><strong>Phong cách:</strong> ${character.type}</p>
        <h3>Thông số:</h3>
    `;
    for (const stat in character.stats) {
        skillsHtml += `<p><strong>${stat}</strong> <span>${character.stats[stat]}</span></p>`;
    }
    skillsHtml += `
        <p><strong>Cốt truyện:</strong> ${character.story}</p>
        <p><strong>Kết thúc:</strong> ${character.ending}</p>
        <h3>🔮 Kỹ năng:</h3>
    `;
    character.skills.forEach(skill => {
        skillsHtml += `
            <div class="skill-item">
                <div class="skill-header">
                    <img src="${skill.image}" alt="${skill.name}" class="skill-icon">
                    <div class="skill-name">${skill.name}</div>
                </div>
                <div class="skill-desc">${skill.desc}</div>
                <div class="skill-cooldown">Hồi chiêu: ${skill.cooldown}s</div>
            </div>
        `;
    });
    content.innerHTML = skillsHtml;
    domCache.skillModal.style.display = 'block';
}

function closeModal() {
    domCache.skillModal.style.display = 'none';
}

function startGame() {
    if (!selectedCharacter) return;
    const character = characterData[selectedCharacter];
    domCache.characterSelect.style.display = 'none';
    domCache.gamePlay.style.display = 'block';
    domCache.avatar.src = character.avatar;

    if (selectedCharacter === 'knight') {
        maxHealth = character.maxHealth;
    } else if (selectedCharacter === 'soldier') {
        maxHealth = character.maxHealth;
    } else if (selectedCharacter === 'cultivator') {
        maxHealth = cultivatorForm === 'melee' ? character.maxHealthMelee : character.maxHealthRanged;
    }
    currentHealth = maxHealth;
    health = 100;
    updateHealthBar();

    domCache.bossName1.style.display = 'none';
    domCache.bossName2.style.display = 'none';
    domCache.bossHealth1.parentElement.style.display = 'none';
    domCache.bossHealth2.parentElement.style.display = 'none';
    domCache.bossEffects1.style.display = 'none';
    domCache.bossEffects2.style.display = 'none';

    if (selectedCharacter === 'cultivator') {
        cultivatorForm = 'melee';
        cultivatorSkills = character.skills.slice(0, 4);
    } else {
        cultivatorSkills = character.skills;
    }

    cultivatorSkills.forEach((skill, i) => {
        const skillBtn = domCache.skillButtons[i];
        if (skillBtn) {
            skillBtn.style.backgroundImage = `url('${skill.image}')`;
            skillBtn.setAttribute('data-cooldown', `${skill.cooldown}s`);
            skillBtn.disabled = false;
            skillBtn.classList.add('glow');
        }
    });

    cooldownDurations = cultivatorSkills.map(skill => skill.cooldown);
    skillCooldowns = new Array(cultivatorSkills.length).fill(0);

    // Initialize player DOM element
    playerX = window.innerWidth / 2;
    playerY = window.innerHeight / 2;
    playerElement = document.createElement('div');
    playerElement.className = 'player-character';
    const playerImg = document.createElement('img');
    playerImg.src = character.avatar;
    playerImg.style.width = `${playerSize}px`;
    playerImg.style.height = `${playerSize}px`;
    playerImg.style.objectFit = 'contain';
    playerElement.appendChild(playerImg);
    playerElement.style.position = 'absolute';
    playerElement.style.left = `${playerX - playerSize / 2}px`;
    playerElement.style.top = `${playerY - playerSize / 2}px`;
    playerElement.style.width = `${playerSize}px`;
    playerElement.style.height = `${playerSize}px`;
    playerElement.style.zIndex = '15';
    domCache.gamePlay.appendChild(playerElement);

    // Set up game loop and event listeners
    spawnEnemies();
    setupGameLoop();
    setupEventListeners();
}

function setupEventListeners() {
    // WASD movement
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(event) {
    if (isPaused) return;
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault(); // Prevent scrolling
        movePlayer(key);
    }
    if (key === 'j') attackEnemies();
    if (key === 'u') useSkill(1);
    if (key === 'i') useSkill(2);
    if (key === 'o') useSkill(3);
    if (key === 'p') useSkill(4);
}

function handleKeyUp(event) {
    // Could add logic for stopping movement if needed
}

function movePlayer(key) {
    const speed = playerSpeed;
    switch (key) {
        case 'w':
            playerY -= speed;
            break;
        case 's':
            playerY += speed;
            break;
        case 'a':
            playerX -= speed;
            break;
        case 'd':
            playerX += speed;
            break;
    }
    // Constrain player within screen boundaries
    playerX = Math.max(playerSize / 2, Math.min(window.innerWidth - playerSize / 2, playerX));
    playerY = Math.max(playerSize / 2, Math.min(window.innerHeight - playerSize / 2, playerY));
    playerElement.style.left = `${playerX - playerSize / 2}px`;
    playerElement.style.top = `${playerY - playerSize / 2}px`;
}

function updateHealthBar() {
    health = Math.max(0, (currentHealth / maxHealth) * 100);
    domCache.health.style.width = `${health}%`;
    domCache.health.setAttribute('title', `${Math.round(currentHealth)} / ${maxHealth}`);
    if (currentHealth <= 0) {
        alert('Bạn đã thua! Trò chơi kết thúc.');
        returnToMainMenu();
    }
}

function updateBossHealth(index, currentHealth, maxHealth) {
    const healthPercent = (currentHealth / maxHealth) * 100;
    const healthElement = index === 0 ? domCache.bossHealth1 : domCache.bossHealth2;
    healthElement.style.width = `${healthPercent}%`;
    healthElement.setAttribute('title', `${Math.round(currentHealth)} / ${maxHealth}`);
}

function getEffectDuration(effectName) {
    const playerSkillMap = {
        ...characterData.knight.skills.reduce((acc, skill) => ({ ...acc, [skill.effect]: skill.duration }), {}),
        ...characterData.cultivator.skills.reduce((acc, skill) => ({ ...acc, [skill.effect]: skill.duration }), {}),
        ...characterData.soldier.skills.reduce((acc, skill) => ({ ...acc, [skill.effect]: skill.duration }), {})
    };
    const bossSkillMap = {};
    Object.keys(bossSkills).forEach(bossType => {
        bossSkills[bossType].forEach(skill => {
            bossSkillMap[skill.effect] = skill.duration;
        });
    });
    return playerSkillMap[effectName] || bossSkillMap[effectName] || 0;
}

function addEffect(targetId, effectName) {
    const effectsContainer = domCache[targetId];
    if (!effectsContainer) return;
    const actualDuration = getEffectDuration(effectName);
    if (actualDuration === 0) return;

    const existingEffect = activeEffects.find(e => e.img.parentElement === effectsContainer && e.effectName === effectName);
    if (existingEffect) {
        existingEffect.startTime = Date.now();
        existingEffect.duration = actualDuration * 1000;
        existingEffect.remainingTime = existingEffect.duration;
        return;
    }

    const effectImg = document.createElement('img');
    effectImg.src = effectImages[effectName] || '';
    if (!effectImg.src) {
        console.warn(`Effect image for ${effectName} not found.`);
        return;
    }
    effectImg.style.opacity = '1';
    effectImg.style.width = '24px';
    effectImg.style.height = '24px';
    effectsContainer.appendChild(effectImg);

    activeEffects.push({
        img: effectImg,
        effectName: effectName,
        duration: actualDuration * 1000,
        remainingTime: actualDuration * 1000,
        startTime: Date.now(),
        paused: false
    });
}

function updateEffectsAndCooldowns() {
    if (isPaused) return;

    const now = Date.now();
    activeEffects = activeEffects.filter(effect => {
        if (effect.paused) return true;
        effect.remainingTime = effect.duration - (now - effect.startTime);
        if (effect.remainingTime <= 0) {
            effect.img.style.opacity = '0';
            setTimeout(() => effect.img.remove(), 300);
            return false;
        }
        return true;
    });

    skillCooldowns.forEach((cooldown, i) => {
        if (cooldown <= 0) return;
        skillCooldowns[i] = Math.max(0, cooldown - 1);
        const button = domCache.skillButtons[i];
        button.setAttribute('data-cooldown', `${skillCooldowns[i]}s`);
        if (skillCooldowns[i] <= 0) {
            button.disabled = false;
            button.classList.add('glow');
            button.setAttribute('data-cooldown', `${cooldownDurations[i]}s`);
        }
    });
}

function pauseGame() {
    isPaused = true;
    domCache.pauseModal.style.display = 'block';
    activeEffects.forEach(effect => {
        effect.paused = true;
        effect.remainingTime = effect.duration - (Date.now() - effect.startTime);
    });
    enemies.forEach(enemy => {
        if (enemy.attackInterval) clearInterval(enemy.attackInterval);
        if (enemy.type !== 'regularMonster') {
            enemy.skillIntervals?.forEach(interval => clearInterval(interval));
        }
    });
}

function resumeGame() {
    isPaused = false;
    domCache.pauseModal.style.display = 'none';
    activeEffects.forEach(effect => {
        effect.paused = false;
        effect.startTime = Date.now();
        effect.duration = effect.remainingTime;
    });
    enemies.forEach(enemy => {
        startEnemyAttack(enemy);
        if (enemy.type !== 'regularMonster') startBossSkillLoop(enemy, enemies.indexOf(enemy));
    });
}

function useSkill(skillIndex) {
    const actualSkillIndex = skillIndex - 1;
    if (skillCooldowns[actualSkillIndex] > 0) return;
    const skill = cultivatorSkills[actualSkillIndex];
    skillCooldowns[actualSkillIndex] = skill.cooldown;
    const button = domCache.skillButtons[actualSkillIndex];
    button.disabled = true;
    button.classList.remove('glow');

    if (selectedCharacter === 'cultivator' && skillIndex === 1) {
        cultivatorForm = cultivatorForm === 'melee' ? 'ranged' : 'melee';
        maxHealth = cultivatorForm === 'melee' ? characterData.cultivator.maxHealthMelee : characterData.cultivator.maxHealthRanged;
        currentHealth = Math.min(currentHealth, maxHealth);
        updateHealthBar();
        const character = characterData['cultivator'];
        cultivatorSkills = cultivatorForm === 'melee' ? character.skills.slice(0, 4) : [character.skills[0], character.skills[4], character.skills[5], character.skills[6]];
        for (let i = 1; i <= 3; i++) {
            const btnIndex = i;
            const skillBtn = domCache.skillButtons[btnIndex];
            const updatedSkill = cultivatorSkills[btnIndex];
            if (skillBtn && updatedSkill) {
                skillBtn.style.backgroundImage = `url('${updatedSkill.image}')`;
                skillBtn.setAttribute('data-cooldown', `${updatedSkill.cooldown}s`);
                skillCooldowns[btnIndex] = 0;
                skillBtn.disabled = false;
                skillBtn.classList.add('glow');
            }
        }
    }

    if (skill.effect) {
        if (debuffEffects.includes(skill.effect)) {
            enemies.forEach((enemy, index) => addEffect(`bossEffects${index % 2 + 1}`, skill.effect));
        } else {
            addEffect('playerEffects', skill.effect);
        }
    }

    if (skill.name === "Hào Quang Chiến Binh" || skill.name === "Kiếm Hút Hồn") {
        currentHealth = Math.min(currentHealth + (skill.name === "Hào Quang Chiến Binh" ? 150 : 0.1 * characterData[selectedCharacter].attack), maxHealth);
        updateHealthBar();
    }
}

function returnToMainMenu() {
    domCache.gamePlay.style.display = 'none';
    domCache.pauseModal.style.display = 'none';
    domCache.mainMenu.style.display = 'flex';
    isPaused = false;
    selectedCharacter = null;
    health = 100;
    maxHealth = 1000;
    currentHealth = maxHealth;
    playerX = null;
    playerY = null;
    cultivatorForm = 'melee';
    cultivatorSkills = [];
    skillCooldowns = [0, 0, 0, 0];
    cooldownDurations = [0, 0, 0, 0];
    enemies = [];
    currentTurn = 1;
    damageTexts = [];

    domCache.skillButtons.forEach(btn => {
        if (btn) {
            btn.style.backgroundImage = '';
            btn.setAttribute('data-cooldown', '');
            btn.disabled = false;
            btn.classList.remove('glow');
        }
    });

    domCache.playerEffects.innerHTML = '';
    domCache.bossEffects1.innerHTML = '';
    domCache.bossEffects2.innerHTML = '';
    activeEffects = [];
    domCache.avatar.src = '';
    domCache.bossName1.textContent = '';
    domCache.bossName2.textContent = '';
    domCache.bossHealth1.style.width = '0%';
    domCache.bossHealth2.style.width = '0%';
    // Remove player element
    if (playerElement) {
        playerElement.remove();
        playerElement = null;
    }
    // Clear enemy elements
    if (domCache.enemyContainer) {
        domCache.enemyContainer.innerHTML = '';
    }
    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
}

function spawnEnemies() {
    enemies = [];
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    if (domCache.enemyContainer) {
        domCache.enemyContainer.innerHTML = ''; // Clear existing enemies
    }

    if (currentTurn === 1) {
        for (let i = 0; i < 3; i++) {
            const randomHP = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
            const randomAttack = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
            const enemy = {
                x: Math.random() * (canvasWidth - 50),
                y: Math.random() * (canvasHeight - 50),
                maxHealth: randomHP,
                health: randomHP,
                size: 50,
                image: characterData.regularMonster.avatar,
                type: 'regularMonster',
                name: 'Quái Thường',
                attack: randomAttack,
                attackSpeed: 1,
                lastAttackTime: 0,
                element: null
            };
            enemy.x = Math.max(enemy.size / 2, Math.min(canvasWidth - enemy.size / 2, enemy.x));
            enemy.y = Math.max(enemy.size / 2, Math.min(canvasHeight - enemy.size / 2, enemy.y));
            createEnemyElement(enemy);
            enemies.push(enemy);
        }
    } else if (currentTurn === 2) {
        for (let i = 0; i < 3; i++) {
            const randomHP = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
            const randomAttack = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
            const enemy = {
                x: Math.random() * (canvasWidth - 50),
                y: Math.random() * (canvasHeight - 50),
                maxHealth: randomHP,
                health: randomHP,
                size: 50,
                image: characterData.regularMonster.avatar,
                type: 'regularMonster',
                name: 'Quái Thường',
                attack: randomAttack,
                attackSpeed: 1,
                lastAttackTime: 0,
                element: null
            };
            enemy.x = Math.max(enemy.size / 2, Math.min(canvasWidth - enemy.size / 2, enemy.x));
            enemy.y = Math.max(enemy.size / 2, Math.min(canvasHeight - enemy.size / 2, enemy.y));
            createEnemyElement(enemy);
            enemies.push(enemy);
        }
        const randomBoss = regularBossTypes[Math.floor(Math.random() * regularBossTypes.length)];
        const boss = {
            x: Math.random() * (canvasWidth - 70),
            y: Math.random() * (canvasHeight - 70),
            maxHealth: characterData[randomBoss].maxHealth,
            health: characterData[randomBoss].maxHealth,
            size: 70,
            image: characterData[randomBoss].avatar,
            type: randomBoss,
            name: String(randomBoss).replace('Boss', 'Boss '),
            attack: characterData[randomBoss].attack,
            attackSpeed: characterData[randomBoss].attackSpeed,
            lastAttackTime: 0,
            skillCooldowns: bossSkills[randomBoss].map(skill => skill.cooldown),
            nextSkillIndex: 0,
            element: null
        };
        boss.x = Math.max(boss.size / 2, Math.min(canvasWidth - boss.size / 2, boss.x));
        boss.y = Math.max(boss.size / 2, Math.min(canvasHeight - boss.size / 2, boss.y));
        createEnemyElement(boss);
        enemies.push(boss);
    } else if (currentTurn === 3) {
        for (let i = 0; i < 3; i++) {
            const randomHP = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
            const randomAttack = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
            const enemy = {
                x: Math.random() * (canvasWidth - 50),
                y: Math.random() * (canvasHeight - 50),
                maxHealth: randomHP,
                health: randomHP,
                size: 50,
                image: characterData.regularMonster.avatar,
                type: 'regularMonster',
                name: 'Quái Thường',
                attack: randomAttack,
                attackSpeed: 1,
                lastAttackTime: 0,
                element: null
            };
            enemy.x = Math.max(enemy.size / 2, Math.min(canvasWidth - enemy.size / 2, enemy.x));
            enemy.y = Math.max(enemy.size / 2, Math.min(canvasHeight - enemy.size / 2, enemy.y));
            createEnemyElement(enemy);
            enemies.push(enemy);
        }
        let availableBosses = [...regularBossTypes];
        const usedBoss = enemies.find(e => e.type !== 'regularMonster')?.type;
        if (usedBoss) availableBosses = availableBosses.filter(b => b !== usedBoss);
        const boss1 = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        availableBosses = availableBosses.filter(b => b !== boss1);
        const boss2 = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        if (boss1 && boss2) {
            const enemy1 = {
                x: Math.random() * (canvasWidth - 70),
                y: Math.random() * (canvasHeight - 70),
                maxHealth: characterData[boss1].maxHealth,
                health: characterData[boss1].maxHealth,
                size: 70,
                image: characterData[boss1].avatar,
                type: boss1,
                name: String(boss1).replace('Boss', 'Boss '),
                attack: characterData[boss1].attack,
                attackSpeed: characterData[boss1].attackSpeed,
                lastAttackTime: 0,
                skillCooldowns: bossSkills[boss1].map(skill => skill.cooldown),
                nextSkillIndex: 0,
                element: null
            };
            const enemy2 = {
                x: Math.random() * (canvasWidth - 70),
                y: Math.random() * (canvasHeight - 70),
                maxHealth: characterData[boss2].maxHealth,
                health: characterData[boss2].maxHealth,
                size: 70,
                image: characterData[boss2].avatar,
                type: boss2,
                name: String(boss2).replace('Boss', 'Boss '),
                attack: characterData[boss2].attack,
                attackSpeed: characterData[boss2].attackSpeed,
                lastAttackTime: 0,
                skillCooldowns: bossSkills[boss2].map(skill => skill.cooldown),
                nextSkillIndex: 0,
                element: null
            };
            enemy1.x = Math.max(enemy1.size / 2, Math.min(canvasWidth - enemy1.size / 2, enemy1.x));
            enemy1.y = Math.max(enemy1.size / 2, Math.min(canvasHeight - enemy1.size / 2, enemy1.y));
            enemy2.x = Math.max(enemy2.size / 2, Math.min(canvasWidth - enemy2.size / 2, enemy2.x));
            enemy2.y = Math.max(enemy2.size / 2, Math.min(canvasHeight - enemy2.size / 2, enemy2.y));
            createEnemyElement(enemy1);
            createEnemyElement(enemy2);
            enemies.push(enemy1, enemy2);
        }
    } else if (currentTurn === 4) {
        const superBoss = superBossTypes[Math.floor(Math.random() * superBossTypes.length)];
        const boss = {
            x: Math.random() * (canvasWidth - 70),
            y: Math.random() * (canvasHeight - 70),
            maxHealth: characterData[superBoss].maxHealth,
            health: characterData[superBoss].maxHealth,
            size: 70,
            image: characterData[superBoss].avatar,
            type: superBoss,
            name: String(superBoss).replace('Boss', 'Boss '),
            attack: characterData[superBoss].attack,
            attackSpeed: characterData[superBoss].attackSpeed,
            lastAttackTime: 0,
            skillCooldowns: bossSkills[superBoss].map(skill => skill.cooldown),
            nextSkillIndex: 0,
            element: null
        };
        boss.x = Math.max(boss.size / 2, Math.min(canvasWidth - boss.size / 2, boss.x));
        boss.y = Math.max(boss.size / 2, Math.min(canvasHeight - boss.size / 2, boss.y));
        createEnemyElement(boss);
        enemies.push(boss);
    }

    // Update boss UI
    enemies.forEach((enemy, index) => {
        if (enemy.type !== 'regularMonster') {
            const bossIndex = index % 2;
            const bossNameElement = bossIndex === 0 ? domCache.bossName1 : domCache.bossName2;
            const bossHealthElement = bossIndex === 0 ? domCache.bossHealth1 : domCache.bossHealth2;
            const bossEffectsElement = bossIndex === 0 ? domCache.bossEffects1 : domCache.bossEffects2;
            bossNameElement.textContent = enemy.name;
            bossNameElement.style.display = 'block';
            bossHealthElement.parentElement.style.display = 'block';
            bossEffectsElement.style.display = 'block';
            updateBossHealth(bossIndex, enemy.health, enemy.maxHealth);
        }
    });
}

function createEnemyElement(enemy) {
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy-character';
    const img = document.createElement('img');
    img.src = enemy.image;
    img.style.width = `${enemy.size}px`;
    img.style.height = `${enemy.size}px`;
    img.style.objectFit = 'contain';
    enemyElement.appendChild(img);

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';
    const health = document.createElement('div');
    health.className = 'health';
    if (enemy.type === 'regularMonster') {
        healthBar.style.width = '20px';
        healthBar.style.height = '3px';
        healthBar.style.backgroundColor = 'red';
        health.style.backgroundColor = 'green';
    } else {
        healthBar.style.width = '30px';
        healthBar.style.height = '5px';
        healthBar.style.backgroundColor = '#555';
        health.style.backgroundColor = 'green';
    }
    health.style.width = '100%';
    healthBar.appendChild(health);
    enemyElement.appendChild(healthBar);

    enemyElement.style.position = 'absolute';
    enemyElement.style.left = `${enemy.x - enemy.size / 2}px`;
    enemyElement.style.top = `${enemy.y - enemy.size / 2}px`;
    enemyElement.style.width = `${enemy.size}px`;
    enemyElement.style.height = `${enemy.size}px`;
    enemy.element = enemyElement;
    if (domCache.enemyContainer) {
        domCache.enemyContainer.appendChild(enemyElement);
    } else {
        console.warn('Enemy container not found. Cannot append enemy element.');
    }

    if (enemy.type !== 'regularMonster') {
        const nameElement = document.createElement('div');
        nameElement.className = 'boss-name';
        nameElement.textContent = enemy.name;
        enemyElement.appendChild(nameElement);
    }
}

function calculateDamage(attacker, target, isPlayerAttack) {
    let baseDamage = isPlayerAttack ? 
        (selectedCharacter === 'cultivator' ? 
            (cultivatorForm === 'melee' ? characterData.cultivator.attackMelee : characterData.cultivator.attackRanged) : 
            characterData[selectedCharacter].attack) : 
        attacker.attack;
    let damageMultiplier = 1.0;

    const effectTargetId = isPlayerAttack ? 'playerEffects' : `bossEffects${enemies.indexOf(attacker) % 2 + 1}`;
    const damageIncrease = activeEffects.some(e => e.effectName === 'tăng thương' && e.img.parentElement.id === effectTargetId && e.remainingTime > 0);
    if (damageIncrease) {
        damageMultiplier += (selectedCharacter === 'knight' ? 0.30 : selectedCharacter === 'soldier' ? 0.50 : 0);
    }

    return Math.floor(baseDamage * damageMultiplier);
}

function showDamageText(x, y, damage) {
    const damageText = document.createElement('div');
    damageText.className = 'damage-text';
    damageText.textContent = `-${damage}`;
    damageText.style.position = 'absolute';
    damageText.style.left = `${x}px`;
    damageText.style.top = `${y - 10}px`;
    damageText.style.color = 'red';
    damageText.style.fontSize = '16px';
    damageText.style.zIndex = '20';
    domCache.gamePlay.appendChild(damageText);

    let opacity = 1;
    let life = 30;
    const animateDamage = () => {
        if (life <= 0) {
            damageText.remove();
            return;
        }
        y -= 1;
        opacity -= 1 / 30;
        damageText.style.top = `${y - 10}px`;
        damageText.style.opacity = opacity;
        life--;
        requestAnimationFrame(animateDamage);
    };
    animateDamage();
}

function startEnemyAttack(enemy) {
    enemy.lastAttackTime = Date.now();
}

function startBossSkillLoop(enemy, index) {
    enemy.skillCooldowns?.forEach((cooldown, i) => {
        const skillData = bossSkills[enemy.type][i];
        enemy.skillCooldowns[i] = 0;
        setTimeout(() => {
            if (!isPaused && enemy.health > 0) {
                if (debuffEffects.includes(skillData.effect)) {
                    addEffect('playerEffects', skillData.effect);
                } else {
                    addEffect(`bossEffects${index % 2 + 1}`, skillData.effect);
                }
            }
            enemy.skillCooldowns[i] = skillData.cooldown;
        }, skillData.cooldown * 1000);
    });
}

function setupGameLoop() {
    const gameLoop = () => {
        if (isPaused) {
            requestAnimationFrame(gameLoop);
            return;
        }

        const now = Date.now();
        if (now - lastUpdateTime < 16) {
            requestAnimationFrame(gameLoop);
            return;
        }
        lastUpdateTime = now;

        updateGameState();
        updateEffectsAndCooldowns();

        requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
}

function updateEnemyHealth(enemy) {
    if (!enemy.element) return;
    const healthElement = enemy.element.querySelector('.health');
    if (!healthElement) return;
    const healthPercent = (enemy.health / enemy.maxHealth) * 100;
    healthElement.style.width = `${healthPercent}%`;
    if (enemy.type !== 'regularMonster') {
        const bossIndex = enemies.indexOf(enemy) % 2;
        updateBossHealth(bossIndex, enemy.health, enemy.maxHealth);
    }
}

function attackEnemies() {
    const attackFrameInterval = Math.round(1000 / characterData[selectedCharacter].attackSpeed);
    const now = Date.now();
    if (now - (window.lastAttackTime || 0) < attackFrameInterval) return;
    window.lastAttackTime = now;

    enemies.forEach(enemy => {
        if (!enemy.element || !enemy.element.parentElement) return;
        const rect = enemy.element.getBoundingClientRect();
        const enemyX = rect.left + enemy.size / 2;
        const enemyY = rect.top + enemy.size / 2;
        const distToPlayer = Math.hypot(playerX - enemyX, playerY - enemyY);
        let attackRange = (selectedCharacter === 'soldier' || (selectedCharacter === 'cultivator' && cultivatorForm === 'ranged')) ? 100 : 50;
        if (distToPlayer <= attackRange) {
            const damage = calculateDamage(null, enemy, true);
            enemy.health = Math.max(0, enemy.health - damage);
            showDamageText(enemyX, enemyY - enemy.size / 2, damage);
            updateEnemyHealth(enemy);
            if (enemy.health <= 0) {
                enemy.element.remove();
                enemies = enemies.filter(e => e.health > 0);
                if (enemies.length === 0) {
                    currentTurn++;
                    if (currentTurn <= 4) {
                        spawnEnemies();
                    } else {
                        alert('Bạn đã hoàn thành game!');
                        returnToMainMenu();
                    }
                }
            }
        }
    });
}

function updateGameState() {
    if (isPaused) return;
    const now = Date.now();

    enemies.forEach(enemy => {
        if (!enemy.element || !enemy.element.parentElement) return;
        const rect = enemy.element.getBoundingClientRect();
        const enemyX = rect.left + enemy.size / 2;
        const enemyY = rect.top + enemy.size / 2;
        const distToPlayer = Math.hypot(playerX - enemyX, playerY - enemyY);

        // Move bosses toward the player
        if (enemy.type !== 'regularMonster' && distToPlayer > 50) {
            const dx = playerX - enemyX;
            const dy = playerY - enemyY;
            const speed = 2;
            enemy.x += (dx / distToPlayer) * speed;
            enemy.y += (dy / distToPlayer) * speed;
            enemy.x = Math.max(enemy.size / 2, Math.min(window.innerWidth - enemy.size / 2, enemy.x));
            enemy.y = Math.max(enemy.size / 2, Math.min(window.innerHeight - enemy.size / 2, enemy.y));
            enemy.element.style.left = `${enemy.x - enemy.size / 2}px`;
            enemy.element.style.top = `${enemy.y - enemy.size / 2}px`;
        }

        const attackIntervalMs = (1 / enemy.attackSpeed) * 1000;
        if (now - enemy.lastAttackTime >= attackIntervalMs && distToPlayer < (enemy.type === 'regularMonster' ? 100 : 150)) {
            enemy.lastAttackTime = now;
            const damage = calculateDamage(enemy, null, false);
            currentHealth = Math.max(0, currentHealth - damage);
            showDamageText(playerX, playerY - playerSize / 2, damage);
            updateHealthBar();
        }
    });
}

function createParticles() {
    const existingParticles = document.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 6 + 's';
        document.body.appendChild(particle);
    }
}

// Initialize DOM cache immediately
initDomCache();

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', function(event) {
            if (!event.target.classList.contains('char-btn')) {
                selectCharacter(this.dataset.character);
            }
        });
    });

    window.onclick = function(event) {
        if (event.target === domCache.skillModal) closeModal();
        else if (event.target === domCache.guideModal) closeGuide();
        else if (event.target === domCache.pauseModal) resumeGame();
    };

    setInterval(createParticles, 15000);
});