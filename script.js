let selectedCharacter = null;
let health = 100;
let maxHealth = 1000;
let currentHealth = maxHealth;
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
let gameTime = 0;

let playerElement = null;
let playerX, playerY;
let playerSize = 70;
let playerSpeed = 5;

const keysPressed = { w: false, a: false, s: false, d: false };

let enemyContainer = null;

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
    enemyContainer: null,
    bossAvatar1: null,
    bossAvatar2: null
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
        { name: 'Gọi Anhem', effect: 'gọi anh em', duration: 0.1, cooldown: 10 },
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
    fireBoss: { avatar: "bosslua.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8, name: "Hỏa Ma Vương" },
    iceBoss: { avatar: "bossbang.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8, name: "Băng Ma Vương" },
    tienBoss: { avatar: "bosstien.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8, name: "Hắc Tiên" },
    maBoss: { avatar: "bossma.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8, name: "Ma Thần" },
    giangHoMangBoss: { avatar: "bossgianghomang.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8, name: "Mafia Internet" },
    khongLoBoss: { avatar: "bosskhonglo.png", maxHealth: 4000, attack: 120, attackSpeed: 0.8, name: "Bự Ngu" },
    thienDaoBoss: { avatar: "thiendao.png", maxHealth: 7000, attack: 180, attackSpeed: 1.2, name: "Thiên Đạo" },
    coGiBoss: { avatar: "sieucogioi.png", maxHealth: 7000, attack: 180, attackSpeed: 1.2, name: "Siêu Cơ Giới Nhân" },
    thienThanSaNgaBoss: { avatar: "thienthansanga.png", maxHealth: 7000, attack: 180, attackSpeed: 1.2, name: "Hắc Ám Thiên Thần" }
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
    let enemyContainer = document.getElementById('enemy-container');
    if (!enemyContainer) {
        enemyContainer = document.createElement('div');
        enemyContainer.id = 'enemy-container';
        enemyContainer.style.position = 'absolute';
        enemyContainer.style.top = '0';
        enemyContainer.style.left = '0';
        enemyContainer.style.width = '100vw';
        enemyContainer.style.height = '100vh';
        enemyContainer.style.pointerEvents = 'none';
        enemyContainer.style.zIndex = '10';
        document.body.appendChild(enemyContainer);
    }
    domCache.enemyContainer = enemyContainer;

    domCache.bossAvatar1 = document.createElement('img');
    domCache.bossAvatar1.className = 'boss-avatar';
    domCache.bossAvatar1.style.width = '40px';
    domCache.bossAvatar1.style.height = '40px';
    domCache.bossAvatar1.style.borderRadius = '50%';
    domCache.bossAvatar1.style.marginRight = '10px';
    domCache.bossAvatar1.style.display = 'none';
    domCache.bossName1.parentElement.insertBefore(domCache.bossAvatar1, domCache.bossName1);

    domCache.bossAvatar2 = document.createElement('img');
    domCache.bossAvatar2.className = 'boss-avatar';
    domCache.bossAvatar2.style.width = '40px';
    domCache.bossAvatar2.style.height = '40px';
    domCache.bossAvatar2.style.borderRadius = '50%';
    domCache.bossAvatar2.style.marginRight = '10px';
    domCache.bossAvatar2.style.display = 'none';
    domCache.bossName2.parentElement.insertBefore(domCache.bossAvatar2, domCache.bossName2);
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
        <p>⚔️ **W, A, S, D**: Di chuyển theo thứ tự trên, trái, xuống, phải (kết hợp để đi chéo)</p>
        <p>⚔️ **J**: Đánh thường</p>
        <p>⚔️ **U, I, O, P**: Kỹ năng 1, 2, 3, 4</p>
        <p>⏸️ **Space**: Tạm dừng/tiếp tục trò chơi</p>
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
    if (!selectedCharacter || !characterData[selectedCharacter]) {
        console.error("Invalid or no character selected:", selectedCharacter);
        alert("Vui lòng chọn một nhân vật trước khi bắt đầu!");
        return;
    }
    const character = characterData[selectedCharacter];
    domCache.characterSelect.style.display = 'none';
    domCache.gamePlay.style.display = 'block';
    domCache.avatar.src = character.avatar;

    if (selectedCharacter === 'knight') {
        maxHealth = character.maxHealth || 1000;
    } else if (selectedCharacter === 'soldier') {
        maxHealth = character.maxHealth || 1000;
    } else if (selectedCharacter === 'cultivator') {
        maxHealth = cultivatorForm === 'melee' ? (character.maxHealthMelee || 650) : (character.maxHealthRanged || 750);
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
    domCache.bossAvatar1.style.display = 'none';
    domCache.bossAvatar2.style.display = 'none';

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

    spawnEnemies();
    setupGameLoop();
    setupEventListeners();
}

function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(event) {
    if (event.key === ' ' && !isPaused) {
        event.preventDefault();
        pauseGame();
        return;
    } else if (event.key === ' ' && isPaused) {
        event.preventDefault();
        resumeGame();
        return;
    }

    if (isPaused) return;
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault();
        keysPressed[key] = true;
    }
    if (key === 'j') attackEnemies();
    if (key === 'u') useSkill(1);
    if (key === 'i') useSkill(2);
    if (key === 'o') useSkill(3);
    if (key === 'p') useSkill(4);
}

function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
        keysPressed[key] = false;
    }
}

function movePlayer() {
    let dx = 0;
    let dy = 0;

    if (keysPressed.w) dy -= playerSpeed;
    if (keysPressed.s) dy += playerSpeed;
    if (keysPressed.a) dx -= playerSpeed;
    if (keysPressed.d) dx += playerSpeed;

    if (dx !== 0 && dy !== 0) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / magnitude) * playerSpeed;
        dy = (dy / magnitude) * playerSpeed;
    }

    if (dx !== 0 || dy !== 0) {
        playerX += dx;
        playerY += dy;
        playerX = Math.max(playerSize / 2, Math.min(window.innerWidth - playerSize / 2, playerX));
        playerY = Math.max(playerSize / 2, Math.min(window.innerHeight - playerSize / 2, playerY));
        playerElement.style.left = `${playerX - playerSize / 2}px`;
        playerElement.style.top = `${playerY - playerSize / 2}px`;
    }
}

function updateHealthBar() {
    const validCurrentHealth = isNaN(currentHealth) || currentHealth === undefined ? 0 : currentHealth;
    const validMaxHealth = isNaN(maxHealth) || maxHealth === undefined || maxHealth === 0 ? 1 : maxHealth;
    
    health = Math.max(0, (validCurrentHealth / validMaxHealth) * 100);
    domCache.health.style.width = `${health}%`;
    domCache.health.textContent = `${Math.round(validCurrentHealth)} / ${validMaxHealth}`;
    domCache.health.setAttribute('title', `${Math.round(validCurrentHealth)} / ${validMaxHealth}`);
    if (validCurrentHealth <= 0) {
        alert('Bạn đã thua! Trò chơi kết thúc.');
        returnToMainMenu();
    }
}

function updateBossHealth(index, currentHealth, maxHealth) {
    const healthPercent = (currentHealth / maxHealth) * 100;
    const healthElement = index === 0 ? domCache.bossHealth1 : domCache.bossHealth2;
    healthElement.style.width = `${healthPercent}%`;
    healthElement.textContent = `${Math.round(currentHealth)} / ${maxHealth}`;
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
        existingEffect.startTime = gameTime;
        existingEffect.duration = actualDuration;
        existingEffect.remainingTime = actualDuration;
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
        duration: actualDuration,
        remainingTime: actualDuration,
        startTime: gameTime,
        paused: false
    });
}

function updateEffectsAndCooldowns() {
    if (isPaused) return;

    activeEffects = activeEffects.filter(effect => {
        if (effect.paused) return true;
        effect.remainingTime = effect.duration - (gameTime - effect.startTime);
        if (effect.remainingTime <= 0) {
            effect.img.style.opacity = '0';
            setTimeout(() => effect.img.remove(), 300);
            return false;
        }
        return true;
    });

    skillCooldowns.forEach((cooldown, i) => {
        if (cooldown > 0) {
            skillCooldowns[i] = Math.max(0, cooldown - (1 / 60));
        }
        const button = domCache.skillButtons[i];
        if (button) {
            button.setAttribute('data-cooldown', `${Math.ceil(skillCooldowns[i])}s`);
            if (skillCooldowns[i] <= 0) {
                button.disabled = false;
                button.classList.add('glow');
            } else {
                button.disabled = true;
                button.classList.remove('glow');
            }
        }
    });

    enemies.forEach(enemy => {
        if (enemy.type !== 'regularMonster' && enemy.skillCooldowns) {
            enemy.skillCooldowns.forEach((cooldown, i) => {
                if (cooldown > 0) {
                    enemy.skillCooldowns[i] = Math.max(0, cooldown - (1 / 60));
                }
                if (enemy.skillCooldowns[i] <= 0) {
                    const skillData = bossSkills[enemy.type][i];
                    if (enemy.health > 0) {
                        const index = enemies.indexOf(enemy);
                        if (debuffEffects.includes(skillData.effect)) {
                            addEffect('playerEffects', skillData.effect);
                        } else {
                            addEffect(`bossEffects${index % 2 + 1}`, skillData.effect);
                        }
                    }
                    enemy.skillCooldowns[i] = skillData.cooldown;
                }
            });
        }
    });
}

function pauseGame() {
    if (isPaused) return;
    isPaused = true;
    domCache.pauseModal.style.display = 'block';
    activeEffects.forEach(effect => {
        effect.paused = true;
        effect.remainingTime = effect.duration - (gameTime - effect.startTime);
    });

    skillCooldowns = skillCooldowns.map(cooldown => Math.max(0, cooldown));
    enemies.forEach(enemy => {
        if (enemy.skillCooldowns) {
            enemy.skillCooldowns = enemy.skillCooldowns.map(cooldown => Math.max(0, cooldown));
        }
    });
}

function resumeGame() {
    if (!isPaused) return;
    isPaused = false;
    domCache.pauseModal.style.display = 'none';
    activeEffects.forEach(effect => {
        effect.paused = false;
        effect.startTime = gameTime;
        effect.duration = effect.remainingTime;
    });

    skillCooldowns.forEach((cooldown, i) => {
        if (cooldown > 0) {
            skillCooldowns[i] = cooldown;
        }
    });
    enemies.forEach(enemy => {
        if (enemy.skillCooldowns) {
            enemy.skillCooldowns.forEach((cooldown, i) => {
                if (cooldown > 0) {
                    enemy.skillCooldowns[i] = cooldown;
                }
            });
        }
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
        const attackValue = selectedCharacter && characterData[selectedCharacter] && characterData[selectedCharacter].attack ? characterData[selectedCharacter].attack : 0;
        const healAmount = skill.name === "Hào Quang Chiến Binh" ? 150 : 0.1 * attackValue;
        if (isNaN(healAmount) || healAmount < 0) {
            console.error(`Invalid heal amount for skill ${skill.name}: ${healAmount}`);
            return;
        }
        currentHealth = Math.min(currentHealth + healAmount, maxHealth);
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
    gameTime = 0; 
    window.lastAttackTime = 0; 

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
    domCache.bossAvatar1.style.display = 'none';
    domCache.bossAvatar2.style.display = 'none';
    if (playerElement) {
        playerElement.remove();
        playerElement = null;
    }
    if (domCache.enemyContainer) {
        domCache.enemyContainer.innerHTML = '';
    }
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    Object.keys(keysPressed).forEach(key => keysPressed[key] = false);
}

function spawnEnemies() {
    enemies = [];
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    if (domCache.enemyContainer) {
        domCache.enemyContainer.innerHTML = ''; 
    }

    if (currentTurn === 1) {
        for (let i = 0; i < 3; i++) {
            const randomHP = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
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
        for (let i = 0; i < 5; i++) {
            const randomHP = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
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
            name: characterData[randomBoss].name, 
            attack: characterData[randomBoss].attack,
            attackSpeed: characterData[randomBoss].attackSpeed,
            lastAttackTime: 0,
            skillCooldowns: bossSkills[randomBoss].map(skill => skill.cooldown),
            nextSkillIndex: 0,
            element: null,
            uiIndex: 0 
        };
        boss.x = Math.max(boss.size / 2, Math.min(canvasWidth - boss.size / 2, boss.x));
        boss.y = Math.max(boss.size / 2, Math.min(canvasHeight - boss.size / 2, boss.y));
        createEnemyElement(boss);
        enemies.push(boss);
    } else if (currentTurn === 3) {
        for (let i = 0; i < 5; i++) {
            const randomHP = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
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
        const usedBoss = enemies.find(e => e.type !== 'regularMonster')?.type || null;
        if (usedBoss) availableBosses = availableBosses.filter(b => b !== usedBoss);
        const boss1Type = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        availableBosses = availableBosses.filter(b => b !== boss1Type);
        const boss2Type = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        if (boss1Type && boss2Type) {
            const enemy1 = {
                x: Math.random() * (canvasWidth - 70),
                y: Math.random() * (canvasHeight - 70),
                maxHealth: characterData[boss1Type].maxHealth,
                health: characterData[boss1Type].maxHealth,
                size: 70,
                image: characterData[boss1Type].avatar,
                type: boss1Type,
                name: characterData[boss1Type].name, 
                attack: characterData[boss1Type].attack,
                attackSpeed: characterData[boss1Type].attackSpeed,
                lastAttackTime: 0,
                skillCooldowns: bossSkills[boss1Type].map(skill => skill.cooldown),
                nextSkillIndex: 0,
                element: null,
                uiIndex: 0 
            };
            const enemy2 = {
                x: Math.random() * (canvasWidth - 70),
                y: Math.random() * (canvasHeight - 70),
                maxHealth: characterData[boss2Type].maxHealth,
                health: characterData[boss2Type].maxHealth,
                size: 70,
                image: characterData[boss2Type].avatar,
                type: boss2Type,
                name: characterData[boss2Type].name,
                attack: characterData[boss2Type].attack,
                attackSpeed: characterData[boss2Type].attackSpeed,
                lastAttackTime: 0,
                skillCooldowns: bossSkills[boss2Type].map(skill => skill.cooldown),
                nextSkillIndex: 0,
                element: null,
                uiIndex: 1 
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
            name: characterData[superBoss].name,
            attack: characterData[superBoss].attack,
            attackSpeed: characterData[superBoss].attackSpeed,
            lastAttackTime: 0,
            skillCooldowns: bossSkills[superBoss].map(skill => skill.cooldown),
            nextSkillIndex: 0,
            element: null,
            uiIndex: 0
        };
        boss.x = Math.max(boss.size / 2, Math.min(canvasWidth - boss.size / 2, boss.x));
        boss.y = Math.max(boss.size / 2, Math.min(canvasHeight - boss.size / 2, boss.y));
        createEnemyElement(boss);
        enemies.push(boss);
    }

    enemies.forEach(enemy => {
        if (enemy.type !== 'regularMonster' && enemy.uiIndex !== undefined) {
            const bossIndex = enemy.uiIndex;
            const bossNameElement = bossIndex === 0 ? domCache.bossName1 : domCache.bossName2;
            const bossHealthElement = bossIndex === 0 ? domCache.bossHealth1 : domCache.bossHealth2;
            const bossEffectsElement = bossIndex === 0 ? domCache.bossEffects1 : domCache.bossEffects2;
            const bossAvatarElement = bossIndex === 0 ? domCache.bossAvatar1 : domCache.bossAvatar2;
            bossNameElement.textContent = enemy.name;
            bossNameElement.style.display = 'block';
            bossHealthElement.parentElement.style.display = 'block';
            bossEffectsElement.style.display = 'block';
            bossAvatarElement.src = enemy.image;
            bossAvatarElement.style.display = 'inline-block';
            updateBossHealth(bossIndex, enemy.health, enemy.maxHealth);
        }
    });

    enemies.forEach((enemy, index) => {
        startEnemyAttack(enemy);
        if (enemy.type !== 'regularMonster') startBossSkillLoop(enemy, index);
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

    if (enemy.type === 'regularMonster') {
        const healthBar = document.createElement('div');
        healthBar.className = 'health-bar';
        const health = document.createElement('div');
        health.className = 'health';
        healthBar.style.width = '20px';
        healthBar.style.height = '3px';
        healthBar.style.backgroundColor = 'red';
        health.style.backgroundColor = 'green';
        health.style.width = '100%';
        healthBar.appendChild(health);
        enemyElement.appendChild(healthBar);
    }

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
}

function calculateDamage(attacker, target, isPlayerAttack) {
    let baseDamage;
    if (isPlayerAttack) {
        if (selectedCharacter === 'cultivator') {
            baseDamage = cultivatorForm === 'melee' ? characterData.cultivator.attackMelee : characterData.cultivator.attackRanged;
        } else if (selectedCharacter === 'knight') {
            baseDamage = characterData.knight.attack;
        } else if (selectedCharacter === 'soldier') {
            baseDamage = characterData.soldier.attack;
        } else {
            baseDamage = 0;
        }
    } else {
        baseDamage = attacker.attack || 0;
    }

    let damageMultiplier = 1.0;

    const effectTargetId = isPlayerAttack ? 'playerEffects' : `bossEffects${enemies.indexOf(attacker) % 2 + 1}`;
    const damageIncrease = activeEffects.some(e => e.effectName === 'tăng thương' && e.img.parentElement.id === effectTargetId && e.remainingTime > 0);
    if (damageIncrease) {
        damageMultiplier += (selectedCharacter === 'knight' ? 0.30 : selectedCharacter === 'soldier' ? 0.50 : selectedCharacter === 'cultivator' ? 0.30 : 0);
    }

    const finalDamage = Math.floor(baseDamage * damageMultiplier);
    if (isNaN(finalDamage) || finalDamage < 0) {
        console.error(`Invalid damage calculated: ${finalDamage}, baseDamage: ${baseDamage}, multiplier: ${damageMultiplier}`);
        return 0;
    }
    return finalDamage;
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
    enemy.lastAttackTime = gameTime;
}

function startBossSkillLoop(enemy, index) {
    enemy.skillCooldowns?.forEach((cooldown, i) => {
        const skillData = bossSkills[enemy.type][i];
        enemy.skillCooldowns[i] = skillData.cooldown;
    });
}

function setupGameLoop() {
    const gameLoop = () => {
        const now = Date.now();
        if (now - lastUpdateTime < 16) {
            requestAnimationFrame(gameLoop);
            return;
        }

        const deltaTime = (now - lastUpdateTime) / 1000;
        if (!isPaused) {
            gameTime += deltaTime;
            skillCooldowns.forEach((cooldown, i) => {
                if (cooldown > 0) {
                    skillCooldowns[i] = Math.max(0, cooldown - deltaTime);
                }
            });

            enemies.forEach(enemy => {
                if (enemy.skillCooldowns) {
                    enemy.skillCooldowns.forEach((cooldown, i) => {
                        if (cooldown > 0) {
                            enemy.skillCooldowns[i] = Math.max(0, cooldown - deltaTime);
                        }
                    });
                }
            });

            movePlayer();
            updateGameState();
            updateEffectsAndCooldowns();
        }

        lastUpdateTime = now;
        requestAnimationFrame(gameLoop);
    };
    lastUpdateTime = Date.now();
    requestAnimationFrame(gameLoop);
}

function updateEnemyHealth(enemy) {
    if (!enemy.element) return;
    const healthElement = enemy.element.querySelector('.health');
    if (healthElement) {
        const healthPercent = (enemy.health / enemy.maxHealth) * 100;
        healthElement.style.width = `${healthPercent}%`;
    }
    if (enemy.type !== 'regularMonster' && enemy.uiIndex !== undefined) {
        updateBossHealth(enemy.uiIndex, enemy.health, enemy.maxHealth);
    }
}

function attackEnemies() {
    const character = characterData[selectedCharacter];
    const attackFrameInterval = character && character.attackSpeed ? (1 / character.attackSpeed) : 1;
    if (gameTime - (window.lastAttackTime || 0) < attackFrameInterval) return;
    window.lastAttackTime = gameTime;

    enemies.forEach(enemy => {
        if (!enemy.element || !enemy.element.parentElement) return;
        const rect = enemy.element.getBoundingClientRect();
        const enemyX = rect.left + enemy.size / 2;
        const enemyY = rect.top + enemy.size / 2;
        const distToPlayer = Math.hypot(playerX - enemyX, playerY - enemyY);

        let attackRange;
        if (selectedCharacter === 'knight') {
            attackRange = 70;
        } else if (selectedCharacter === 'soldier') {
            attackRange = 100;
        } else if (selectedCharacter === 'cultivator') {
            attackRange = cultivatorForm === 'melee' ? 70 : 100;
        } else {
            attackRange = 70;
        }

        if (distToPlayer <= attackRange) {
            const damage = calculateDamage(null, enemy, true);
            if (damage > 0) {
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
        }
    });
}

function updateGameState() {
    if (isPaused) return;

    enemies.forEach(enemy => {
        if (!enemy.element || !enemy.element.parentElement) return;
        const rect = enemy.element.getBoundingClientRect();
        const enemyX = rect.left + enemy.size / 2;
        const enemyY = rect.top + enemy.size / 2;
        const distToPlayer = Math.hypot(playerX - enemyX, playerY - enemyY);

        if (distToPlayer > 50) {
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

        const attackInterval = 1 / enemy.attackSpeed;
        if (gameTime - enemy.lastAttackTime >= attackInterval) {
            enemy.lastAttackTime = gameTime;
            let enemyAttackRange = 30;
            if (enemy.type !== 'regularMonster' && !superBossTypes.includes(enemy.type)) {
                enemyAttackRange = 40;
            } else if (superBossTypes.includes(enemy.type)) {
                enemyAttackRange = 50;
            }
            if (distToPlayer < enemyAttackRange) {
                const damage = calculateDamage(enemy, null, false);
                currentHealth = Math.max(0, currentHealth - damage);
                showDamageText(playerX, playerY - playerSize / 2, damage);
                updateHealthBar();
            }
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

    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.9;
    }

    const playAudio = () => {
        if (bgMusic) {
            bgMusic.play().catch(() => {});
        }
        window.removeEventListener('click', playAudio);
        window.removeEventListener('keydown', playAudio);
    };

    window.addEventListener('click', playAudio);
    window.addEventListener('keydown', playAudio);
});