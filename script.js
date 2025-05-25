let selectedCharacter = null;
let health = 100;
let skillCooldowns = [0, 0, 0, 0];
let cooldownDurations = [0, 0, 0, 0];
let cooldownIntervals = [null, null, null, null];
let playerImage;
let enemies = [
    { x: 300, y: 300, health: 4000, size: 70, image: null, type: 'fireBoss', name: 'Boss Lửa' },
    { x: 400, y: 200, health: 4000, size: 70, image: null, type: 'iceBoss', name: 'Boss Băng' }
];
let playerX, playerY;
let playerSize = 70;
let gameCanvas;
let cultivatorForm = 'melee';
let cultivatorSkills = [];
let isPaused = false;
let activeEffects = [];

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
    'huyết hải': 'huuthai.png',
    'huyết tế': 'huutte.png',
    'gọi anh em': 'goianhem.png',
    'phím thủ': 'phimthu.png',
    'đập đất': 'dapdat.png',
    'khiên đất': 'khiendat.png',
    'lôi kiếp': 'loikiep.png',
    'uy áp': 'uyap.png',
    'trói buộc': 'troibuoc.png',
    'nhất khí hóa tam thanh': 'nhatkhihotamthanh.png',
    'đạn lửa': 'danlua.png',
    'khiên plasma': 'khienplasma.png',
    'bão từ': 'baotu.png',
    'drone hỗ trợ': 'dronehotro.png',
    'gươm thiên địa': 'guomthiendi.png',
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
        stats: { "Máu:": "1200 HP", "Sát thương:": "80", "Tốc đánh:": "1.2 đòn/s", "DPS:": "96", "Loại:": "Tanker, Cận chiến" },
        story: "Công chúa bị quỷ bắt, vương quốc giao nhiệm vụ",
        ending: "Cầu hôn tại lễ hội ánh sáng",
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
        stats: { "Máu (Cận):": "800 HP", "Máu (Xa):": "900 HP", "ST (Cận):": "100", "ST (Xa):": "75 AOE", "Loại:": "Linh hoạt, Đa năng" },
        story: "Thánh nữ sở hữu thiên phú cao, lúc độ kiếp với thiên đạo bị tiên ma tính kế",
        ending: "Cùng tu tiên quy ẩn nơi tiên cảnh",
        skills: [
            { name: "Thức Tỉnh Linh Thể", desc: "Chuyển đổi giữa cận ↔ xa (0.5s delay)", cooldown: 20, effect: '', image: "skill5.png", duration: 0 },
            { name: "Kiếm Vũ Linh Hồn", desc: "Tăng 30% sát thương cận trong 5s", cooldown: 10, effect: 'tăng thương', image: "skill6.png", duration: 5 },
            { name: "Kiếm Hút Hồn", desc: "Hồi 10% máu theo damage gây ra (5s hiệu lực)", cooldown: 12, effect: 'hồi máu', image: "skill7.png", duration: 5 },
            { name: "Linh Kiếm Trảm", desc: "Gây 150 sát thương cận, làm choáng 1s", cooldown: 15, effect: 'choáng', image: "skill8.png", duration: 1 },
            { name: "Hư Không Tốc Bộ", desc: "Tăng tốc chạy 50% trong 3s", cooldown: 10, effect: 'tăng tốc chạy', image: "skill9.png", duration: 3 },
            { name: "Lôi Kiếm Trận", desc: "Triệu hồi kiếm trận gây 50 sát thương/s trong 4s", cooldown: 14, effect: '', image: "skill10.png", duration: 0 },
            { name: "Tốc Kiếm Pháp", desc: "Tăng tốc đánh 40% trong 5s", cooldown: 10, effect: 'tăng tốc đánh', image: "skill11.png", duration: 5 }
        ],
        avatar: "imagethanhtutachnen.png"
    },
    soldier: {
        name: "Đặc Binh",
        type: "Phong cách Hiện Đại",
        stats: { "Máu:": "700 HP", "Sát thương:": "120", "Tốc đánh:": "2 đòn/s", "DPS:": "240", "Loại:": "Đánh xa, ST cao" },
        story: "Đại minh tinh số 1 ngành giải trí bị bắt cóc, được thuê về để giải cứu",
        ending: "Giải cứu, kết hôn và ẩn danh",
        skills: [
            { name: "Nội Tại Tập Kích", desc: "Tăng 50% sát thương trong 4 giây", cooldown: 10, effect: 'tăng thương', image: "skill12.png", duration: 4 },
            { name: "Bọc Thép Chiến Thuật", desc: "Tăng 200 máu tạm thời trong 5 giây", cooldown: 12, effect: '', image: "skill13.png", duration: 0 },
            { name: "Đạn Xuyên Phá", desc: "+30% dame + làm chậm địch 3 giây", cooldown: 10, effect: 'làm chậm', image: "skill14.png", duration: 3 },
            { name: "Tiếp Đạn Nhanh", desc: "Tăng tốc đánh 50% trong 4 giây", cooldown: 10, effect: 'tăng tốc đánh', image: "skill15.png", duration: 4 }
        ],
        avatar: "imagebinhchungtachnen.png"
    },
    fireBoss: { avatar: "bosslua.png" },
    iceBoss: { avatar: "bossbang.png" }
};

function showCharacterSelect() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('characterSelect').style.display = 'block';
    createParticles();
}

function showMainMenu() {
    document.getElementById('characterSelect').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'flex';
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
    const modal = document.getElementById('guideModal');
    document.getElementById('guideContent').innerHTML = `
        <h2>📖 Hướng Dẫn</h2>
        <p>⚔️ **W, A, S, D**: Di chuyển theo thứ tự trên, trái, xuống, phải</p>
        <p>⚔️ **J**: Đánh thường</p>
        <p>⚔️ **U, I, O, P**: Kỹ năng 1, 2, 3, 4</p>
    `;
    modal.style.display = 'block';
}

function closeGuide() {
    document.getElementById('guideModal').style.display = 'none';
}

function exitGame() {
    if (confirm('🚪 Bạn có chắc chắn muốn thoát game không?')) {
        window.close();
    }
}

function selectCharacter(characterType) {
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
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
    const modal = document.getElementById('skillModal');
    const content = document.getElementById('skillContent');

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
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('skillModal').style.display = 'none';
}

function startGame() {
    if (!selectedCharacter) return;

    const character = characterData[selectedCharacter];
    document.getElementById('characterSelect').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    document.getElementById('avatar').src = character.avatar;
    health = 100;
    updateHealthBar();
    document.getElementById('bossHealth1').style.width = '100%';
    document.getElementById('bossHealth2').style.width = '100%';
    document.getElementById('bossName1').textContent = enemies[0].name;
    document.getElementById('bossName2').textContent = enemies[1].name;

    if (selectedCharacter === 'cultivator') {
        cultivatorForm = 'melee';
        cultivatorSkills = character.skills.slice(0, 4);
    } else {
        cultivatorSkills = character.skills;
    }

    cultivatorSkills.forEach((skill, i) => {
        const skillBtn = document.getElementById(`skill${i + 1}`);
        if (skillBtn) {
            skillBtn.style.backgroundImage = `url('${skill.image}')`;
            skillBtn.setAttribute('data-cooldown', `${skill.cooldown}s`);
            skillBtn.disabled = false;
            skillBtn.classList.add('glow');
        }
    });

    cooldownDurations = cultivatorSkills.map(skill => skill.cooldown);
    skillCooldowns = new Array(cultivatorSkills.length).fill(0);
    cooldownIntervals = new Array(cultivatorSkills.length).fill(null);

    new p5(sketch);
}

function updateHealthBar() {
    const healthElement = document.getElementById('health');
    healthElement.style.width = `${health}%`;
}

function updateBossHealth(index, healthPercent) {
    const healthElement = document.getElementById(`bossHealth${index + 1}`);
    healthElement.style.width = `${healthPercent}%`;
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
    const effectsContainer = document.getElementById(`${targetId}`);
    if (!effectsContainer) return;

    const actualDuration = getEffectDuration(effectName);
    if (actualDuration === 0) return;

    const existingEffect = activeEffects.find(e => e.img.parentElement === effectsContainer && e.effectName === effectName);
    if (existingEffect) {
        const elapsed = Date.now() - existingEffect.startTime;
        const remainingTime = Math.max(0, existingEffect.duration - elapsed);
        existingEffect.duration = remainingTime + (actualDuration * 1000);
        existingEffect.remainingTime = existingEffect.duration;
        existingEffect.startTime = Date.now();
        clearTimeout(existingEffect.fadeTimeout);
        clearTimeout(existingEffect.removeTimeout);
        updateEffect(existingEffect);
        return;
    }

    const effectImg = document.createElement('img');
    effectImg.src = effectImages[effectName] || '';
    if (!effectImg.src) {
        console.warn(`Effect image for ${effectName} not found in effectImages.`);
        return;
    }

    effectImg.style.opacity = '1';
    effectImg.style.width = '24px';
    effectImg.style.height = '24px';
    effectsContainer.appendChild(effectImg);

    const effect = {
        img: effectImg,
        effectName: effectName,
        duration: actualDuration * 1000,
        remainingTime: actualDuration * 1000,
        startTime: Date.now(),
        fadeTimeout: null,
        removeTimeout: null,
        paused: false
    };

    activeEffects.push(effect);
    updateEffect(effect);
}

function updateEffect(effect) {
    if (effect.paused) return;

    const elapsed = Date.now() - effect.startTime;
    effect.remainingTime = effect.duration - elapsed;

    if (effect.remainingTime <= 0) {
        effect.img.style.opacity = '0';
        effect.removeTimeout = setTimeout(() => {
            effect.img.remove();
            activeEffects = activeEffects.filter(e => e !== effect);
        }, 300);
        return;
    }

    effect.fadeTimeout = setTimeout(() => updateEffect(effect), 100);
}

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseModal').style.display = 'block';
    if (typeof noLoop !== 'undefined') {
        noLoop();
    }

    cooldownIntervals.forEach(interval => {
        if (interval) {
            clearInterval(interval);
        }
    });

    activeEffects.forEach(effect => {
        if (effect.fadeTimeout) clearTimeout(effect.fadeTimeout);
        if (effect.removeTimeout) clearTimeout(effect.removeTimeout);
        effect.paused = true;
        effect.remainingTime = effect.duration - (Date.now() - effect.startTime);
    });
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseModal').style.display = 'none';
    if (typeof loop !== 'undefined') {
        loop();
    }

    skillCooldowns.forEach((cooldown, i) => {
        if (cooldown > 0) {
            updateCooldowns(i);
        }
    });

    activeEffects.forEach(effect => {
        effect.paused = false;
        effect.startTime = Date.now();
        effect.duration = effect.remainingTime;
        updateEffect(effect);
    });
}

function useSkill(skillIndex) {
    const actualSkillIndex = skillIndex - 1;
    if (skillCooldowns[actualSkillIndex] > 0) return;

    const skill = cultivatorSkills[actualSkillIndex];

    if (selectedCharacter === 'cultivator' && skillIndex === 1) {
        cultivatorForm = cultivatorForm === 'melee' ? 'ranged' : 'melee';

        const character = characterData['cultivator'];
        if (cultivatorForm === 'melee') {
            cultivatorSkills = character.skills.slice(0, 4);
        } else {
            cultivatorSkills = [character.skills[0], character.skills[4], character.skills[5], character.skills[6]];
        }

        for (let i = 1; i <= 3; i++) {
            const btnIndex = i;
            const skillBtn = document.getElementById(`skill${btnIndex + 1}`);
            const updatedSkill = cultivatorSkills[btnIndex];
            if (skillBtn && updatedSkill) {
                skillBtn.style.backgroundImage = `url('${updatedSkill.image}')`;
                skillBtn.setAttribute('data-cooldown', `${updatedSkill.cooldown}s`);
                skillCooldowns[btnIndex] = 0;
                if (cooldownIntervals[btnIndex]) {
                    clearInterval(cooldownIntervals[btnIndex]);
                    cooldownIntervals[btnIndex] = null;
                }
                skillBtn.disabled = false;
                skillBtn.classList.add('glow');
            }
        }
    }

    skillCooldowns[actualSkillIndex] = skill.cooldown;
    const button = document.getElementById(`skill${skillIndex}`);
    button.disabled = true;
    button.classList.remove('glow');
    updateCooldowns(actualSkillIndex);

    if (skill.effect) {
        if (debuffEffects.includes(skill.effect)) {
            enemies.forEach((enemy, index) => {
                addEffect(`bossEffects${index + 1}`, skill.effect);
            });
        } else {
            addEffect('playerEffects', skill.effect);
        }
    }
}

function updateCooldowns(skillIndex) {
    const button = document.getElementById(`skill${skillIndex + 1}`);
    const duration = cooldownDurations[skillIndex];
    const intervalTime = 1000;

    if (cooldownIntervals[skillIndex]) {
        clearInterval(cooldownIntervals[skillIndex]);
    }

    cooldownIntervals[skillIndex] = setInterval(() => {
        if (isPaused) return;

        skillCooldowns[skillIndex]--;
        if (skillCooldowns[skillIndex] < 0) {
            skillCooldowns[skillIndex] = 0;
        }

        button.setAttribute('data-cooldown', `${skillCooldowns[skillIndex]}s`);

        if (skillCooldowns[skillIndex] <= 0) {
            clearInterval(cooldownIntervals[skillIndex]);
            cooldownIntervals[skillIndex] = null;
            button.disabled = false;
            button.classList.add('glow');
            button.setAttribute('data-cooldown', `${cooldownDurations[skillIndex]}s`);
        }
    }, intervalTime);
}

function returnToMainMenu() {
    document.getElementById('gamePlay').style.display = 'none';
    document.getElementById('pauseModal').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'flex';
    
    isPaused = false;
    selectedCharacter = null;
    health = 100;
    playerX = null;
    playerY = null;
    playerImage = null;
    cultivatorForm = 'melee';
    cultivatorSkills = [];
    skillCooldowns = [0, 0, 0, 0];
    cooldownDurations = [0, 0, 0, 0];
    cooldownIntervals = [null, null, null, null];
    enemies = [
        { x: 300, y: 300, health: 4000, size: 70, image: null, type: 'fireBoss', name: 'Boss Lửa' },
        { x: 400, y: 200, health: 4000, size: 70, image: null, type: 'iceBoss', name: 'Boss Băng' }
    ];
    
    for (let i = 1; i <= 4; i++) {
        const skillBtn = document.getElementById(`skill${i}`);
        if (skillBtn) {
            skillBtn.style.backgroundImage = '';
            skillBtn.setAttribute('data-cooldown', '');
            skillBtn.disabled = false;
            skillBtn.classList.remove('glow');
        }
    }
    
    if (gameCanvas) {
        gameCanvas.remove();
        gameCanvas = null;
    }
    
    document.getElementById('playerEffects').innerHTML = '';
    document.getElementById('bossEffects1').innerHTML = '';
    document.getElementById('bossEffects2').innerHTML = '';
    activeEffects.forEach(effect => {
        if (effect.fadeTimeout) clearTimeout(effect.fadeTimeout);
        if (effect.removeTimeout) clearTimeout(effect.removeTimeout);
    });
    activeEffects = [];
    
    document.getElementById('avatar').src = '';
    
    if (typeof noLoop !== 'undefined') {
        noLoop();
    }
}

function sketch(p) {
    p.preload = function() {
        playerImage = p.loadImage(characterData[selectedCharacter].avatar,
            () => console.log('Player image loaded'),
            () => console.error('Failed to load player image')
        );
        enemies.forEach(enemy => {
            enemy.image = p.loadImage(characterData[enemy.type].avatar,
                () => console.log(`${enemy.type} image loaded`),
                () => console.error(`Failed to load ${enemy.type} image`)
            );
            enemy.skillCooldowns = bossSkills[enemy.type].map(skill => skill.cooldown);
            enemy.skillIntervals = new Array(bossSkills[enemy.type].length).fill(null);
            enemy.nextSkillIndex = 0;
        });
    };

    p.setup = function() {
        gameCanvas = p.createCanvas(p.windowWidth, p.windowHeight).parent('p5-canvas');
        playerX = p.width / 2;
        playerY = p.height / 2;

        const existingParticles = document.querySelectorAll('#p5-canvas .map-particle');
        existingParticles.forEach(particle => particle.remove());

        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'map-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            document.getElementById('p5-canvas').appendChild(particle);
        }

        enemies.forEach((enemy, index) => {
            startBossSkillLoop(enemy, index);
        });
    };

    p.draw = function() {
        if (isPaused) return;

        p.background(15, 12, 41);

        for (let y = 0; y < p.height; y++) {
            let inter = p.map(y, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(15, 12, 41), p.color(48, 43, 99), inter);
            p.stroke(c);
            p.line(0, y, p.width, y);
        }

        handlePlayerMovement(p);

        p.imageMode(p.CENTER);
        if (playerImage) {
            p.tint(255, 255, 255);
            p.image(playerImage, playerX, playerY, playerSize, playerSize);
        } else {
            p.fill(255, 0, 0);
            p.ellipse(playerX, playerY, playerSize, playerSize);
        }

        enemies.forEach((enemy, index) => {
            if (enemy.health > 0) {
                if (enemy.image) {
                    p.tint(255, 0, 0, 150);
                    p.image(enemy.image, enemy.x, enemy.y, enemy.size, playerSize);
                } else {
                    p.fill(0, 255, 0);
                    p.ellipse(enemy.x, enemy.y, enemy.size, enemy.size);
                }

                let dx = playerX - enemy.x;
                let dy = playerY - enemy.y;
                let distance = p.dist(playerX, playerY, enemy.x, enemy.y);
                if (distance > 50) {
                    enemy.x += (dx / distance) * 2;
                    enemy.y += (dy / distance) * 2;
                }

                enemy.x = p.constrain(enemy.x, enemy.size / 2, p.width - enemy.size / 2);
                enemy.y = p.constrain(enemy.y, enemy.size / 2, p.height - playerSize / 2);

                if (p.keyIsDown(74) && p.frameCount % 10 === 0) {
                    let distToEnemy = p.dist(playerX, playerY, enemy.x, enemy.y);
                    let attackRange = (selectedCharacter === 'soldier' || (selectedCharacter === 'cultivator' && cultivatorForm === 'ranged')) ? 100 : 50;
                    if (distToEnemy < attackRange) {
                        enemy.health -= 10;
                        updateBossHealth(index, (enemy.health / 4000) * 100);
                        if (enemy.health <= 0) {
                            enemy.health = 0;
                            console.log(`${enemy.name} đã bị hạ gục!`);
                        }
                    }
                }
            }
        });

        if (p.keyIsDown(85)) useSkill(1);
        if (p.keyIsDown(73)) useSkill(2);
        if (p.keyIsDown(79)) useSkill(3);
        if (p.keyIsDown(80)) useSkill(4);
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

function handlePlayerMovement(p) {
    let playerSpeed = 5;

    if (p.keyIsDown(87)) playerY -= playerSpeed;
    if (p.keyIsDown(83)) playerY += playerSpeed;
    if (p.keyIsDown(65)) playerX -= playerSpeed;
    if (p.keyIsDown(68)) playerX += playerSpeed;

    playerX = p.constrain(playerX, playerSize / 2, p.width - playerSize / 2);
    playerY = p.constrain(playerY, playerSize / 2, p.height - playerSize / 2);
}

function createParticles() {
    const existingParticles = document.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDelay = Math.random() * 6 + 's';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 6000);
        }, i * 200);
    }
}

function startBossSkillLoop(enemy, index) {
    enemy.skillIntervals.forEach((interval, i) => {
        if (interval) clearInterval(interval);
    });

    enemy.skillIntervals = bossSkills[enemy.type].map((skill, i) => {
        return setInterval(() => {
            if (isPaused || enemy.health <= 0) return;

            const skillData = bossSkills[enemy.type][i];
            if (debuffEffects.includes(skillData.effect)) {
                addEffect('playerEffects', skillData.effect);
            } else {
                addEffect(`bossEffects${index + 1}`, skillData.effect);
            }
            enemy.nextSkillIndex = (i + 1) % bossSkills[enemy.type].length;
        }, skill.cooldown * 1000);
    });
}

document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', function(event) {
        if (!event.target.classList.contains('char-btn')) {
            selectCharacter(this.dataset.character);
        }
    });
});

window.onclick = function(event) {
    const skillModal = document.getElementById('skillModal');
    const guideModal = document.getElementById('guideModal');
    const pauseModal = document.getElementById('pauseModal');

    if (event.target === skillModal) {
        closeModal();
    } else if (event.target === guideModal) {
        closeGuide();
    } else if (event.target === pauseModal) {
        resumeGame();
    }
};

setInterval(createParticles, 10000);