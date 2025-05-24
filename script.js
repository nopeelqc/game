let selectedCharacter = null;
let health = 100;
let skillCooldowns = [0, 0, 0, 0];
let cooldownDurations = [0, 0, 0, 0];
let cooldownIntervals = [null, null, null, null];
let playerImage;
let enemies = [
    { x: 300, y: 300, health: 50, size: 70, image: null, type: 'knight' },
    { x: 400, y: 200, health: 50, size: 70, image: null, type: 'cultivator' },
    { x: 500, y: 400, health: 50, size: 70, image: null, type: 'soldier' }
];
let playerX, playerY;
let playerSize = 70;
let gameCanvas;
let cultivatorForm = 'melee';
let cultivatorSkills = [];

const characterData = {
    knight: {
        name: "Kỵ Sĩ",
        type: "Phong cách Châu Âu",
        stats: {
            "Máu:": "1200 HP",
            "Sát thương:": "80",
            "Tốc đánh:": "1.2 đòn/s",
            "DPS:": "96",
            "Loại:": "Tanker, Cận chiến"
        },
        story: "Công chúa bị quỷ bắt, vương quốc giao nhiệm vụ",
        ending: "Cầu hôn tại lễ hội ánh sáng",
        skills: [
            { name: "Thánh Khiên", desc: "Giảm 50% sát thương nhận vào trong 3 giây", cooldown: "10s", image: "skill1.png" },
            { name: "Hào Quang Chiến Binh", desc: "Hồi 150 HP tức thì", cooldown: "12s", image: "skill2.png" },
            { name: "Chém Nghiền Nát", desc: "Tăng 30% sát thương trong 5 giây", cooldown: "10s", image: "skill3.png" },
            { name: "Cuồng Kích", desc: "Tăng tốc đánh 40% trong 4 giây", cooldown: "12s", image: "skill4.png" }
        ],
        avatar: "imageknighttachnen.png"
    },
    cultivator: {
        name: "Thánh Tử",
        type: "Phong cách Tu Tiên",
        stats: {
            "Máu (Cận):": "800 HP",
            "Máu (Xa):": "900 HP",
            "ST (Cận):": "100",
            "ST (Xa):": "75 AOE",
            "Loại:": "Linh hoạt, Đa năng"
        },
        story: "Thánh nữ sở hữu thiên phú cao, lúc độ kiếp với thiên đạo bị tiên ma tính kế",
        ending: "Cùng tu tiên quy ẩn nơi tiên cảnh",
        skills: [
            { name: "Thức Tỉnh Linh Thể", desc: "Chuyển đổi giữa cận ↔ xa (0.5s delay)", cooldown: "20s", image: "skill5.png" },
            // gần
            { name: "Kiếm Vũ Linh Hồn", desc: "Tăng 30% sát thương cận trong 5s", cooldown: "10s", image: "skill6.png" },
            { name: "Kiếm Hút Hồn", desc: "Hồi 10% máu theo damage gây ra (5s hiệu lực)", cooldown: "12s", image: "skill7.png" },
            { name: "Linh Kiếm Trảm", desc: "Gây 150 sát thương cận, làm choáng 1s", cooldown: "15s", image: "skill8.png" },
            // xa
            { name: "Hư Không Tốc Bộ", desc: "Tăng tốc chạy 50% trong 3s", cooldown: "10s", image: "skill9.png" },
            { name: "Lôi Kiếm Trận", desc: "Triệu hồi kiếm trận gây 50 sát thương/s trong 4s", cooldown: "14s", image: "skill10.png" },
            { name: "Tốc Kiếm Pháp", desc: "Tăng tốc đánh 40% trong 5s", cooldown: "10s", image: "skill11.png" }
        ],
        avatar: "imagethanhtutachnen.png"
    },
    soldier: {
        name: "Đặc Binh",
        type: "Phong cách Hiện Đại",
        stats: {
            "Máu:": "700 HP",
            "Sát thương:": "120",
            "Tốc đánh:": "2 đòn/s",
            "DPS:": "240",
            "Loại:": "Đánh xa, ST cao"
        },
        story: "Đại minh tinh số 1 ngành giải trí bị bắt cóc, được thuê về để giải cứu",
        ending: "Giải cứu, kết hôn và ẩn danh",
        skills: [
            { name: "Nội Tại Tập Kích", desc: "Tăng 50% sát thương trong 4 giây", cooldown: "10s", image: "skill12.png" },
            { name: "Bọc Thép Chiến Thuật", desc: "Tăng 200 máu tạm thời trong 5 giây", cooldown: "12s", image: "skill13.png" },
            { name: "Đạn Xuyên Phá", desc: "+30% dame + làm chậm địch 3 giây", cooldown: "10s", image: "skill14.png" },
            { name: "Tiếp Đạn Nhanh", desc: "Tăng tốc đánh 50% trong 4 giây", cooldown: "10s", image: "skill15.png" }
        ],
        avatar: "imagebinhchungtachnen.png"
    }
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
    alert('🤝 Cảm ơn bạn muốn đóng góp! Hãy liên hệ với chúng tôi qua email: contribute@fantasyquest.com');
}

function showGuide() {
    const modal = document.getElementById('guideModal');
    document.getElementById('guideContent').innerHTML = `
        <h2>📖 Hướng Dẫn</h2>
        <p>WASD là di chuyển theo thứ tự là trên, trái, xuống, phải, J đánh thường, UIOP là kỹ năng 1 2 3 4.</p>
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
    if (selectedCharacter) {
        startBtn.style.display = 'block';
    } else {
        startBtn.style.display = 'none';
    }
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
    
    for (let stat in character.stats) {
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
                <div class="skill-name">${skill.name}</div>
                <div class="skill-desc">${skill.desc}</div>
                <div class="skill-cooldown">Hồi chiêu: ${skill.cooldown}</div>
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

    if (selectedCharacter === 'cultivator') {
        cultivatorForm = 'melee';
        cultivatorSkills = [
            character.skills[0],
            character.skills[1],
            character.skills[2],
            character.skills[3]
        ];
    } else {
        cultivatorSkills = character.skills;
    }

    for (let i = 1; i <= 4; i++) {
        const skillBtn = document.getElementById(`skill${i}`);
        const skill = cultivatorSkills[i - 1];
        skillBtn.style.backgroundImage = `url(${skill.image})`;
        skillBtn.setAttribute('data-cooldown', skill.cooldown);
    }

    cooldownDurations = cultivatorSkills.map(skill => parseInt(skill.cooldown));
    skillCooldowns = [0, 0, 0, 0];
    cooldownIntervals = [null, null, null, null]; // Reset intervals

    new p5(sketch);
}

function updateHealthBar() {
    const healthElement = document.getElementById('health');
    healthElement.style.width = `${health}%`;
}

function useSkill(skillIndex) {
    if (skillCooldowns[skillIndex - 1] > 0) return;
    
    if (selectedCharacter === 'cultivator' && skillIndex === 1) {
        cultivatorForm = cultivatorForm === 'melee' ? 'ranged' : 'melee';
    
        const character = characterData['cultivator'];
        if (cultivatorForm === 'melee') {
            cultivatorSkills = [
                character.skills[0],
                character.skills[1],
                character.skills[2],
                character.skills[3]
            ];
        } else {
            cultivatorSkills = [
                character.skills[0],
                character.skills[4],
                character.skills[5],
                character.skills[6]
            ];
        }

        for (let i = 2; i <= 4; i++) {
            const skillBtn = document.getElementById(`skill${i}`);
            const skill = cultivatorSkills[i - 1];
            skillBtn.style.backgroundImage = `url(${skill.image})`;
            skillBtn.setAttribute('data-cooldown', skill.cooldown);

            if (cooldownIntervals[i - 1]) {
                clearInterval(cooldownIntervals[i - 1]);
                cooldownIntervals[i - 1] = null;
            }

            skillCooldowns[i - 1] = 0;
            skillBtn.disabled = false;
            skillBtn.classList.add('glow');
            skillBtn.setAttribute('data-cooldown', `${parseInt(skill.cooldown)}s`);
        }

        cooldownDurations = cultivatorSkills.map(skill => parseInt(skill.cooldown));
    }

    skillCooldowns[skillIndex - 1] = cooldownDurations[skillIndex - 1];
    const button = document.getElementById(`skill${skillIndex}`);
    button.disabled = true;
    button.classList.remove('glow');
    updateCooldowns(skillIndex - 1);
}

function updateCooldowns(skillIndex) {
    const button = document.getElementById(`skill${skillIndex + 1}`);
    const startTime = Date.now();
    const duration = cooldownDurations[skillIndex] * 1000;
    const slowdownFactor = 1.2;

    if (cooldownIntervals[skillIndex]) {
        clearInterval(cooldownIntervals[skillIndex]);
    }

    cooldownIntervals[skillIndex] = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const adjustedElapsed = elapsed / slowdownFactor;
        const remaining = Math.max(0, duration - adjustedElapsed);
        skillCooldowns[skillIndex] = remaining / 1000;

        button.setAttribute('data-cooldown', `${Math.ceil(skillCooldowns[skillIndex])}s`);

        if (skillCooldowns[skillIndex] <= 0) {
            clearInterval(cooldownIntervals[skillIndex]);
            cooldownIntervals[skillIndex] = null;
            button.disabled = false;
            button.classList.add('glow');
            button.setAttribute('data-cooldown', `${cooldownDurations[skillIndex]}s`);
        }
    }, 100);
}

function sketch(p) {
    p.setup = function() {
        gameCanvas = p.createCanvas(window.innerWidth, window.innerHeight).parent('p5-canvas');
        playerX = p.width / 2;
        playerY = p.height / 2;
        playerImage = p.loadImage(characterData[selectedCharacter].avatar);
        enemies.forEach(enemy => {
            enemy.image = p.loadImage(characterData[enemy.type].avatar);
        });

        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'map-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            document.getElementById('p5-canvas').appendChild(particle);
        }
    };

    p.draw = function() {
        p.background(15, 12, 41);
        
        for (let y = 0; y < p.height; y++) {
            let inter = p.map(y, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(15, 12, 41), p.color(48, 43, 99), inter);
            p.stroke(c);
            p.line(0, y, p.width, y);
        }

        handlePlayerMovement(p);

        p.imageMode(p.CENTER);
        p.tint(255, 255, 255);
        p.image(playerImage, playerX, playerY, playerSize, playerSize);

        enemies.forEach(enemy => {
            if (enemy.health > 0) {
                p.tint(255, 0, 0, 150);
                p.image(enemy.image, enemy.x, enemy.y, enemy.size, enemy.size);

                let dx = playerX - enemy.x;
                let dy = playerY - enemy.y;
                let distance = p.sqrt(dx * dx + dy * dy);
                if (distance > 50) {
                    enemy.x += dx / distance * 2;
                    enemy.y += dy / distance * 2;
                }

                enemy.x = p.constrain(enemy.x, 0, p.width);
                enemy.y = p.constrain(enemy.y, 0, p.height);

                if (p.keyIsDown(74) && p.frameCount % 10 === 0) {
                    let dx = enemy.x - playerX;
                    let dy = enemy.y - playerY;
                    let distance = p.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        enemy.health -= 10;
                        if (enemy.health <= 0) enemy.health = 0;
                    }
                }
            }
        });

        if (p.keyIsDown(85) && skillCooldowns[0] <= 0) useSkill(1);
        if (p.keyIsDown(73) && skillCooldowns[1] <= 0) useSkill(2);
        if (p.keyIsDown(79) && skillCooldowns[2] <= 0) useSkill(3);
        if (p.keyIsDown(80) && skillCooldowns[3] <= 0) useSkill(4);
    };

    p.windowResized = function() {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
}

function handlePlayerMovement(p) {
    if (p.keyIsDown(87)) playerY -= 5;
    if (p.keyIsDown(83)) playerY += 5;
    if (p.keyIsDown(65)) playerX -= 5;
    if (p.keyIsDown(68)) playerX += 5;

    playerX = p.constrain(playerX, playerSize/2, p.width - playerSize/2);
    playerY = p.constrain(playerY, playerSize/2, p.height - playerSize/2);
}

function createParticles() {
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

document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', function() {
        if (!this.querySelector('.char-btn:hover')) {
            selectCharacter(this.dataset.character);
        }
    });
});

window.onclick = function(event) {
    const skillModal = document.getElementById('skillModal');
    const guideModal = document.getElementById('guideModal');
    if (event.target === skillModal) {
        closeModal();
    } else if (event.target === guideModal) {
        closeGuide();
    }
}

setInterval(createParticles, 10000);