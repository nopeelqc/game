let selectedCharacter = null;
let characterGenders = {
    knight: 'male',
    cultivator: 'male',
    soldier: 'male'
};

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
            { name: "Thánh Khiên", desc: "Giảm 50% sát thương nhận vào trong 3 giây", cooldown: "10s" },
            { name: "Hào Quang Chiến Binh", desc: "Hồi 150 HP tức thì", cooldown: "12s" },
            { name: "Chém Nghiền Nát", desc: "Tăng 30% sát thương trong 5 giây", cooldown: "10s" },
            { name: "Cuồng Kích", desc: "Tăng tốc đánh 40% trong 4 giây", cooldown: "12s" }
        ]
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
            { name: "Thức Tỉnh Linh Thể", desc: "Chuyển đổi giữa cận ↔ xa (0.5s delay)", cooldown: "5s" },
            { name: "Kiếm Vũ Linh Hồn", desc: "Tăng 30% sát thương cận trong 5s (skill dạng cận)", cooldown: "10s" },
            { name: "Phi Kiếm Hủy Diệt", desc: "Gây 100 AOE sát thương (skill dạng xa)", cooldown: "8s" },
            { name: "Kiếm Hút Hồn", desc: "Hồi 10% máu theo damage gây ra (5s hiệu lực, skill dạng cận)", cooldown: "12s" },
            { name: "Hư Không Tốc Bộ", desc: "Tăng tốc chạy 50% trong 3s (skill dạng xa)", cooldown: "10s" },
            { name: "Kim Thân Phù", desc: "Giảm 50% sát thương trong 3s (skill cận)", cooldown: "10s" },
            { name: "Tốc Kiếm Pháp", desc: "Tăng tốc đánh 40% trong 5s (skill xa)", cooldown: "10s" }
        ]
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
        story: "Đại minh tinh số 1 ngành giải trí bị bắt cóc",
        ending: "Giải cứu, kết hôn và ẩn danh",
        skills: [
            { name: "Nội Tại Tập Kích", desc: "Tăng 50% sát thương trong 4 giây", cooldown: "10s" },
            { name: "Bọc Thép Chiến Thuật", desc: "Tăng 200 máu tạm thời trong 5 giây", cooldown: "12s" },
            { name: "Đạn Xuyên Phá", desc: "+30% dame + làm chậm địch 3 giây", cooldown: "10s" },
            { name: "Tiếp Đạn Nhanh", desc: "Tăng tốc đánh 50% trong 4 giây", cooldown: "10s" }
        ]
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

function exitGame() {
    if(confirm('🚪 Bạn có chắc chắn muốn thoát game không?')) {
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

function toggleGender(button) {
    const card = button.closest('.character-card');
    const characterType = card.dataset.character;
    
    if (characterGenders[characterType] === 'male') {
        characterGenders[characterType] = 'female';
        button.textContent = 'Nam';
        const image = card.querySelector('.character-image img');
        switch(characterType) {
            case 'knight':
                image.src = 'imageprincess.png';
                break;
            case 'cultivator':
                image.src = 'imagethanhnu.png';
                break;
            case 'soldier':
                image.src = 'imagedannu.png';
                break;
        }
    } else {
        characterGenders[characterType] = 'male';
        button.textContent = 'Nữ';
        const image = card.querySelector('.character-image img');
        switch(characterType) {
            case 'knight':
                image.src = 'imageknight.png';
                break;
            case 'cultivator':
                image.src = 'imagethanhtu.png';
                break;
            case 'soldier':
                image.src = 'imagebinhchung.png';
                break;
        }
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
        skillsHtml += `<p><strong>${stat}</strong> <span>${character.stats[stat]}</一支span></p>`;
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
    
    const characterName = characterData[selectedCharacter].name;
    const gender = characterGenders[selectedCharacter] === 'male' ? 'Male' : 'Female';
    
    alert(`🚀 Bắt đầu phiêu lưu với ${characterName} (${gender})!\n\nGame sẽ được phát triển thêm trong phiên bản tiếp theo. Cảm ơn bạn đã chơi thử!`);
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
    const modal = document.getElementById('skillModal');
    if (event.target === modal) {
        closeModal();
    }
}

setInterval(createParticles, 10000);