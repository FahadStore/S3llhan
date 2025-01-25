// ===================== بيانات الأنميات مع السيرفرات =====================
const animes = [
  {
    id: 1,
    name: "One Piece",
    image: "https://m.media-amazon.com/images/I/81rEhhwbubL._AC_UF1000,1000_QL80_.jpg",
    description: "انطلق لوفي في رحلته ليصبح ملك القراصنة...",
    quality: "1080p",
    status: "مستمر",
    episodesCount: 1000,
    rating: "8.8 من 10",
    imdbRating: "8.7",
    likes: "99+",
    dislikes: "10-",
    bannerBackground: "https://cdn11.bigcommerce.com/s-k0hjo2yyrq/images/stencil/1280x1280/products/1228/1288/One_Piece_Pirate_Warriors_3_Standard_Edition_Product_Banner__21737.1726658226.jpg?c=1",
    episodes: [
      {
        title: "الحلقة 1",
        servers: [
          { name: "سيرفر 1", link: "https://www.dailymotion.com/video/x81qix5" },
          { name: "سيرفر 2", link: "https://example.com/one-piece-ep1-server3" }
        ]
      },
      {
        title: "الحلقة 2",
        servers: [
          { name: "سيرفر 1", link: "https://www.dailymotion.com/video/x81qix5" },
          { name: "سيرفر 2", link: "https://example.com/one-piece-ep2-server3" }
        ]
      },
      {
        title: "الحلقة 3",
        servers: [
          { name: "سيرفر 1", link: "https://www.dailymotion.com/video/x81qix5" },
          { name: "سيرفر 2", link: "https://example.com/one-piece-ep3-server3" }
        ]
      },
    ],
    seasons: []
  },
  {
    id: 2,
    name: "Bleach",
    image: "https://m.media-amazon.com/images/M/MV5BOWQwOWY5NTUtMjAyZi00YjQzLTkwODgtNmQwZjU1MGIzZDhjXkEyXkFqcGc@._V1_.jpg",
    description: "مغامرات إيتشيغو كوروساكي 死神،",
    quality: "1080p",
    status: "مستمر",
    episodesCount: 1000,
    rating: "8.8 من 10",
    imdbRating: "8.7",
    likes: "99+",
    dislikes: "10-",
    bannerBackground: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/07/ichigo-kurosaki-and-bleach-brave-soul-banner.jpg",
    episodes: [
      {
        title: "الحلقة 1",
        servers: [
          { name: "سيرفر 1", link: "https://www.dailymotion.com/video/x81qix5" },
          { name: "سيرفر 2", link: "https://example.com/bleach-ep1-server3" }
        ]
      },
      {
        title: "الحلقة 2",
        servers: [
          { name: "سيرفر 1", link: "https://www.dailymotion.com/video/x81qix5" },
          { name: "سيرفر 2", link: "https://example.com/bleach-ep2-server3" }
        ]
      },
      {
        title: "الحلقة 3",
        servers: [
          { name: "سيرفر 1", link: "https://www.dailymotion.com/video/x81qix5" },
          { name: "سيرفر 2", link: "https://example.com/bleach-ep3-server3" }
        ]
      },
    ],
    seasons: []
  },
  // يمكنك إضافة المزيد من الأنميات هنا...
];

// ===================== متغيرات عامة =====================
let currentAnimeData = null;  // تخزين بيانات الأنمي الحالي
let currentEpisodeIndex = 0;  // تخزين مؤشر الحلقة الحالية

// ===================== شاشة الافتتاحية =====================
function handleOpeningAnimation() {
  const openingAnimation = document.getElementById('openingAnimation');
  if (openingAnimation) {
    openingAnimation.addEventListener('animationend', () => {
      openingAnimation.style.display = 'none';
    });
  }
}

// ===================== الصفحة الرئيسية (index.html) =====================
function loadAnimesOnIndex() {
  const animeListContainer = document.getElementById("anime-list");
  if (!animeListContainer) return;

  animes.forEach((anime) => {
    const card = document.createElement("div");
    card.className = "anime-card";

    const img = document.createElement("img");
    img.src = anime.image;
    img.alt = anime.name;
    card.appendChild(img);

    const title = document.createElement("h3");
    title.textContent = anime.name;
    card.appendChild(title);

    const watchButton = document.createElement("button");
    watchButton.textContent = "مشاهدة";
    watchButton.addEventListener("click", () => {
      if (isUserLoggedIn()) {
        showLoading();
        setTimeout(() => {
          window.location.href = `episodes.html?id=${anime.id}`;
        }, 1200);
      } else {
        window.location.href = "logtoWeb.html";
      }
    });
    card.appendChild(watchButton);

    animeListContainer.appendChild(card);
  });
}

// ===================== صفحة الحلقات (episodes.html) =====================
function loadAnimeInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = parseInt(urlParams.get("id"), 10);

  currentAnimeData = animes.find((anime) => anime.id === animeId);
  if (!currentAnimeData) return;

  fillBannerBackground(currentAnimeData);
  fillBanner(currentAnimeData);
  fillEpisodes(currentAnimeData);
  fillSeasons(currentAnimeData);
  setupWatchingControls(currentAnimeData);

  currentEpisodeIndex = 0;
  if (currentAnimeData.episodes.length > 0) {
    fillServersForEpisode(0);
  }
}

// تعبئة خلفية البانر
function fillBannerBackground(animeData) {
  const bannerBg = document.getElementById('bannerBg');
  if (bannerBg && animeData.bannerBackground) {
    bannerBg.style.backgroundImage = `url(${animeData.bannerBackground})`;
  }
}

// تعبئة معلومات البانر
function fillBanner(animeData) {
  const bannerContent = document.getElementById('bannerContent');
  const bannerImage = document.getElementById('bannerImage');
  if (!bannerContent || !bannerImage) return;

  bannerContent.innerHTML = `
    <h1>${animeData.name}</h1>
    <p>${animeData.description}</p>
    <ul>
      <li><i class="fas fa-high-definition"></i> جودة: ${animeData.quality}</li>
      <li><i class="fas fa-tv"></i> حالة: ${animeData.status}</li>
      <li><i class="fas fa-film"></i> عدد الحلقات: ${animeData.episodesCount}</li>
      ${animeData.imdbRating ? `<li><i class="fab fa-imdb"></i> تقييم IMDB: ${animeData.imdbRating}</li>` : ""}
    </ul>
    <div class="like-dislike-buttons">
      <button class="like-btn">أعجبني ${animeData.likes || ""}</button>
      <button class="dislike-btn">لم يعجبني ${animeData.dislikes || ""}</button>
    </div>
  `;

  const posterImg = document.createElement('img');
  posterImg.src = animeData.image;
  posterImg.alt = animeData.name;
  bannerImage.appendChild(posterImg);
}

// المواسم
function fillSeasons(animeData) {
  const seasonsGrid = document.getElementById('seasonsGrid');
  if (!seasonsGrid) return;
  if (!animeData.seasons || animeData.seasons.length === 0) {
    seasonsGrid.innerHTML = "<p>لا توجد مواسم إضافية</p>";
    return;
  }

  animeData.seasons.forEach(season => {
    const card = document.createElement('div');
    card.className = 'season-card';

    const img = document.createElement('img');
    img.src = season.image;
    img.alt = `الموسم ${season.number}`;

    const overlay = document.createElement('div');
    overlay.className = 'season-overlay';
    overlay.textContent = `الموسم ${season.number}`;

    card.appendChild(img);
    card.appendChild(overlay);
    seasonsGrid.appendChild(card);
  });
}

// الحلقات
function fillEpisodes(animeData) {
  const episodeList = document.getElementById('episodeList');
  if (!episodeList) return;

  if (animeData.episodes && animeData.episodes.length) {
    animeData.episodes.forEach((ep, index) => {
      const epDiv = document.createElement('div');
      epDiv.className = 'episode-item';

      // نص الحلقة وزر التشغيل
      epDiv.innerHTML = `
        <span>${ep.title}</span>
        <button>شغل</button>
      `;
      // عند الضغط: نحدد الحلقة الحالية + عرض سيرفراتها
      const playBtn = epDiv.querySelector('button');
      playBtn.addEventListener('click', () => {
        if (isUserLoggedIn()) {
          showLoading();
          setTimeout(() => {
            hideLoading();
            showMessage("تم تشغيل: " + ep.title, "success");

            // جعل هذه الحلقة هي الحالية
            currentEpisodeIndex = index;
            updateCurrentEpisodeLabel(ep.title);

            // عرض السيرفرات الخاصة بهذه الحلقة
            fillServersForEpisode(index);
          }, 1000);
        } else {
          window.location.href = "logtoWeb.html";
        }
      });

      episodeList.appendChild(epDiv);
    });
  } else {
    episodeList.innerHTML = "<p>لا توجد حلقات متاحة حاليًا.</p>";
  }
}

// ===================== عرض السيرفرات لحلقة محددة =====================
function fillServersForEpisode(epIndex) {
  const serverList = document.getElementById("serverList");
  const videoContainer = document.getElementById("videoContainer");

  if (!serverList || !videoContainer) return;

  serverList.innerHTML = "";
  videoContainer.innerHTML = "<p>اختر سيرفرًا لتشغيل الحلقة هنا.</p>";

  const servers = currentAnimeData.episodes[epIndex].servers;
  servers.forEach((server) => {
    const srvDiv = document.createElement("div");
    srvDiv.className = "server-item";
    srvDiv.innerHTML = `<span>${server.name}</span>`;
    srvDiv.addEventListener("click", () => {
      videoContainer.innerHTML = `
        <iframe src="${server.link}" frameborder="0" allowfullscreen></iframe>
      `;
    });
    serverList.appendChild(srvDiv);
  });
}

// ===================== قائمة المشاهدة أسفل الصفحة =====================
function setupWatchingControls(animeData) {
  const currentLabel = document.getElementById('currentEpisodeLabel');
  const prevBtn = document.getElementById('prevEpisodeBtn');
  const nextBtn = document.getElementById('nextEpisodeBtn');

  if (!currentLabel || !prevBtn || !nextBtn) return;

  // لو عندنا حلقات، نختار صفر افتراضياً
  currentEpisodeIndex = 0;
  if (animeData.episodes && animeData.episodes.length > 0) {
    currentLabel.textContent = animeData.episodes[0].title;
  } else {
    currentLabel.textContent = "--";
  }

  // الحلقة السابقة
  prevBtn.addEventListener('click', () => {
    if (!animeData.episodes || animeData.episodes.length === 0) return;
    if (currentEpisodeIndex > 0) {
      currentEpisodeIndex--;
      const newTitle = animeData.episodes[currentEpisodeIndex].title;
      updateCurrentEpisodeLabel(newTitle);
      fillServersForEpisode(currentEpisodeIndex);
      showMessage("انتقلت إلى " + newTitle, "success");
    } else {
      showMessage("لا توجد حلقة سابقة!", "error");
    }
  });

  // الحلقة القادمة
  nextBtn.addEventListener('click', () => {
    if (!animeData.episodes || animeData.episodes.length === 0) return;
    if (currentEpisodeIndex < animeData.episodes.length - 1) {
      currentEpisodeIndex++;
      const newTitle = animeData.episodes[currentEpisodeIndex].title;
      updateCurrentEpisodeLabel(newTitle);
      fillServersForEpisode(currentEpisodeIndex);
      showMessage("انتقلت إلى " + newTitle, "success");
    } else {
      showMessage("وصلت لنهاية الحلقات!", "info");
    }
  });
}

function updateCurrentEpisodeLabel(title) {
  const currentLabel = document.getElementById('currentEpisodeLabel');
  if (currentLabel) currentLabel.textContent = title;
}

// ===================== التعامل مع نموذج الاشتراك =====================
function handleCreateAccountForm() {
  const form = document.getElementById('createAccountForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  const strengthBar = document.getElementById('strengthBar');

  // دالة لحساب قوة كلمة المرور
  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  }

  // دالة لتحديث مؤشر القوة
  function updateStrengthBar(password) {
    const strength = calculatePasswordStrength(password);
    strengthBar.className = 'strength-bar'; // إعادة تعيين الفئة
    if (strength <= 2) {
      strengthBar.classList.add('low');
    } else if (strength === 3 || strength === 4) {
      strengthBar.classList.add('medium');
    } else if (strength >= 5) {
      strengthBar.classList.add('high');
    }
  }

  // دالة لعرض رسائل الخطأ
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // دالة لإخفاء رسائل الخطأ
  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  // حدث إدخال كلمة المرور لتحديث مؤشر القوة
  passwordInput.addEventListener('input', () => {
    updateStrengthBar(passwordInput.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    hideError(nameError);
    hideError(emailError);
    hideError(passwordError);
    hideError(confirmPasswordError);

    let isValid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // التحقق من الاسم
    if (name === '') {
      showError(nameError, "يرجى إدخال اسمك الكامل.");
      isValid = false;
    }

    // التحقق من البريد الإلكتروني باستخدام تعبير منتظم
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      showError(emailError, "يرجى إدخال بريدك الإلكتروني.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      showError(emailError, "يرجى إدخال بريد إلكتروني صالح.");
      isValid = false;
    } else if (isEmailRegistered(email)) {
      showError(emailError, "البريد الإلكتروني مسجل بالفعل.");
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (password === '') {
      showError(passwordError, "يرجى إدخال كلمة المرور.");
      isValid = false;
    } else if (password.length < 8) {
      showError(passwordError, "يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
      isValid = false;
    }

    // التحقق من تأكيد كلمة المرور
    if (confirmPassword === '') {
      showError(confirmPasswordError, "يرجى تأكيد كلمة المرور.");
      isValid = false;
    } else if (password !== confirmPassword) {
      showError(confirmPasswordError, "كلمتا المرور غير متطابقتين.");
      isValid = false;
    }

    if (isValid) {
      // إنشاء حساب جديد
      const users = getUsers();
      users.push({ name, email, password });
      saveUsers(users);

      // تسجيل الدخول تلقائيًا بعد إنشاء الحساب
      setUserLoggedIn(email);

      // عرض شاشة التحميل ثم توجيه المستخدم إلى صفحة الاشتراك
      showLoading();
      setTimeout(() => {
        hideLoading();
        showMessage("تم إنشاء الحساب بنجاح! تم توجيهك إلى صفحة الاشتراك.", "success");
        form.reset();
        strengthBar.className = 'strength-bar'; // إعادة تعيين مؤشر القوة
        setTimeout(() => {
          window.location.href = "subscription.html";
        }, 2000);
      }, 1500);
    }
  });
}

// ===================== التعامل مع نموذج تسجيل الدخول =====================
function handleLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  const emailError = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');

  // دالة لعرض رسائل الخطأ
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // دالة لإخفاء رسائل الخطأ
  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    hideError(emailError);
    hideError(passwordError);

    let isValid = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // التحقق من البريد الإلكتروني
    if (email === '') {
      showError(emailError, "يرجى إدخال بريدك الإلكتروني.");
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (password === '') {
      showError(passwordError, "يرجى إدخال كلمة المرور.");
      isValid = false;
    }

    if (isValid) {
      const users = getUsers();
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        // تسجيل الدخول
        setUserLoggedIn(email);

        // عرض شاشة التحميل ثم توجيه المستخدم إلى صفحة الاشتراك
        showLoading();
        setTimeout(() => {
          hideLoading();
          showMessage("تم تسجيل الدخول بنجاح! تم توجيهك إلى صفحة الاشتراك.", "success");
          form.reset();
          setTimeout(() => {
            window.location.href = "subscription.html";
          }, 2000);
        }, 1500);
      } else {
        showError(passwordError, "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      }
    }
  });
}

// ===================== التحقق من تسجيل الدخول =====================
function isUserLoggedIn() {
  return localStorage.getItem('loggedInUser') !== null;
}

// ===================== تسجيل الدخول =====================
function setUserLoggedIn(email) {
  localStorage.setItem('loggedInUser', email);
}

// ===================== تسجيل الخروج =====================
function setUserLoggedOut() {
  localStorage.removeItem('loggedInUser');
}

// ===================== الحصول على قائمة المستخدمين =====================
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// ===================== حفظ قائمة المستخدمين =====================
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// ===================== التحقق من تسجيل البريد الإلكتروني =====================
function isEmailRegistered(email) {
  const users = getUsers();
  return users.some(user => user.email === email);
}

// ===================== التعامل مع نموذج الاشتراك =====================
function handleSubscriptionForm() {
  const form = document.getElementById('subscriptionForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  const strengthBar = document.getElementById('strengthBar');

  // دالة لحساب قوة كلمة المرور
  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  }

  // دالة لتحديث مؤشر القوة
  function updateStrengthBar(password) {
    const strength = calculatePasswordStrength(password);
    strengthBar.className = 'strength-bar'; // إعادة تعيين الفئة
    if (strength <= 2) {
      strengthBar.classList.add('low');
    } else if (strength === 3 || strength === 4) {
      strengthBar.classList.add('medium');
    } else if (strength >= 5) {
      strengthBar.classList.add('high');
    }
  }

  // دالة لعرض رسائل الخطأ
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // دالة لإخفاء رسائل الخطأ
  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  // حدث إدخال كلمة المرور لتحديث مؤشر القوة
  passwordInput.addEventListener('input', () => {
    updateStrengthBar(passwordInput.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    hideError(nameError);
    hideError(emailError);
    hideError(passwordError);
    hideError(confirmPasswordError);

    let isValid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // التحقق من الاسم
    if (name === '') {
      showError(nameError, "يرجى إدخال اسمك الكامل.");
      isValid = false;
    }

    // التحقق من البريد الإلكتروني باستخدام تعبير منتظم
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      showError(emailError, "يرجى إدخال بريدك الإلكتروني.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      showError(emailError, "يرجى إدخال بريد إلكتروني صالح.");
      isValid = false;
    } else if (isEmailRegistered(email)) {
      showError(emailError, "البريد الإلكتروني مسجل بالفعل.");
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (password === '') {
      showError(passwordError, "يرجى إدخال كلمة المرور.");
      isValid = false;
    } else if (password.length < 8) {
      showError(passwordError, "يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
      isValid = false;
    }

    // التحقق من تأكيد كلمة المرور
    if (confirmPassword === '') {
      showError(confirmPasswordError, "يرجى تأكيد كلمة المرور.");
      isValid = false;
    } else if (password !== confirmPassword) {
      showError(confirmPasswordError, "كلمتا المرور غير متطابقتين.");
      isValid = false;
    }

    if (isValid) {
      // إنشاء حساب جديد
      const users = getUsers();
      users.push({ name, email, password });
      saveUsers(users);

      // تسجيل الدخول تلقائيًا بعد إنشاء الحساب
      setUserLoggedIn(email);

      // عرض شاشة التحميل ثم توجيه المستخدم إلى صفحة الاشتراك
      showLoading();
      setTimeout(() => {
        hideLoading();
        showMessage("تم إنشاء الحساب بنجاح! تم توجيهك إلى صفحة الاشتراك.", "success");
        form.reset();
        strengthBar.className = 'strength-bar'; // إعادة تعيين مؤشر القوة
        setTimeout(() => {
          window.location.href = "subscription.html";
        }, 2000);
      }, 1500);
    }
  });
}

// ===================== التعامل مع نموذج تسجيل الدخول =====================
function handleLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  const emailError = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');

  // دالة لعرض رسائل الخطأ
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // دالة لإخفاء رسائل الخطأ
  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    hideError(emailError);
    hideError(passwordError);

    let isValid = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // التحقق من البريد الإلكتروني
    if (email === '') {
      showError(emailError, "يرجى إدخال بريدك الإلكتروني.");
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (password === '') {
      showError(passwordError, "يرجى إدخال كلمة المرور.");
      isValid = false;
    }

    if (isValid) {
      const users = getUsers();
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        // تسجيل الدخول
        setUserLoggedIn(email);

        // عرض شاشة التحميل ثم توجيه المستخدم إلى صفحة الاشتراك
        showLoading();
        setTimeout(() => {
          hideLoading();
          showMessage("تم تسجيل الدخول بنجاح! تم توجيهك إلى صفحة الاشتراك.", "success");
          form.reset();
          setTimeout(() => {
            window.location.href = "subscription.html";
          }, 2000);
        }, 1500);
      } else {
        showError(passwordError, "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      }
    }
  });
}

// ===================== التحقق من تسجيل الدخول =====================
function isUserLoggedIn() {
  return localStorage.getItem('loggedInUser') !== null;
}

// ===================== تسجيل الدخول =====================
function setUserLoggedIn(email) {
  localStorage.setItem('loggedInUser', email);
}

// ===================== تسجيل الخروج =====================
function setUserLoggedOut() {
  localStorage.removeItem('loggedInUser');
}

// ===================== الحصول على قائمة المستخدمين =====================
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

// ===================== حفظ قائمة المستخدمين =====================
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// ===================== التحقق من تسجيل البريد الإلكتروني =====================
function isEmailRegistered(email) {
  const users = getUsers();
  return users.some(user => user.email === email);
}

// ===================== التعامل مع نموذج الاشتراك =====================
function handleSubscriptionForm() {
  const form = document.getElementById('subscriptionForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  const strengthBar = document.getElementById('strengthBar');

  // دالة لحساب قوة كلمة المرور
  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  }

  // دالة لتحديث مؤشر القوة
  function updateStrengthBar(password) {
    const strength = calculatePasswordStrength(password);
    strengthBar.className = 'strength-bar'; // إعادة تعيين الفئة
    if (strength <= 2) {
      strengthBar.classList.add('low');
    } else if (strength === 3 || strength === 4) {
      strengthBar.classList.add('medium');
    } else if (strength >= 5) {
      strengthBar.classList.add('high');
    }
  }

  // دالة لعرض رسائل الخطأ
  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  // دالة لإخفاء رسائل الخطأ
  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  // حدث إدخال كلمة المرور لتحديث مؤشر القوة
  passwordInput.addEventListener('input', () => {
    updateStrengthBar(passwordInput.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    hideError(nameError);
    hideError(emailError);
    hideError(passwordError);
    hideError(confirmPasswordError);

    let isValid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // التحقق من الاسم
    if (name === '') {
      showError(nameError, "يرجى إدخال اسمك الكامل.");
      isValid = false;
    }

    // التحقق من البريد الإلكتروني باستخدام تعبير منتظم
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      showError(emailError, "يرجى إدخال بريدك الإلكتروني.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      showError(emailError, "يرجى إدخال بريد إلكتروني صالح.");
      isValid = false;
    } else if (isEmailRegistered(email)) {
      showError(emailError, "البريد الإلكتروني مسجل بالفعل.");
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (password === '') {
      showError(passwordError, "يرجى إدخال كلمة المرور.");
      isValid = false;
    } else if (password.length < 8) {
      showError(passwordError, "يجب أن تكون كلمة المرور 8 أحرف على الأقل.");
      isValid = false;
    }

    // التحقق من تأكيد كلمة المرور
    if (confirmPassword === '') {
      showError(confirmPasswordError, "يرجى تأكيد كلمة المرور.");
      isValid = false;
    } else if (password !== confirmPassword) {
      showError(confirmPasswordError, "كلمتا المرور غير متطابقتين.");
      isValid = false;
    }

    if (isValid) {
      // إنشاء حساب جديد
      const users = getUsers();
      users.push({ name, email, password });
      saveUsers(users);

      // تسجيل الدخول تلقائيًا بعد إنشاء الحساب
      setUserLoggedIn(email);

      // عرض شاشة التحميل ثم توجيه المستخدم إلى صفحة الاشتراك
      showLoading();
      setTimeout(() => {
        hideLoading();
        showMessage("تم إنشاء الحساب بنجاح! تم توجيهك إلى صفحة الاشتراك.", "success");
        form.reset();
        strengthBar.className = 'strength-bar'; // إعادة تعيين مؤشر القوة
        setTimeout(() => {
          window.location.href = "subscription.html";
        }, 2000);
      }, 1500);
    }
  });
}

// ===================== شاشة التحميل =====================
function showLoading() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'flex';
}

function hideLoading() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) loadingScreen.style.display = 'none';
}

// ===================== نظام الرسائل (Message System) =====================
function showMessage(text, type = "info") {
  const container = document.getElementById('messageContainer');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  container.appendChild(msg);

  // إخفاء بعد 3 ثوان
  setTimeout(() => {
    msg.classList.add('fade-out');
    setTimeout(() => {
      if (container.contains(msg)) {
        container.removeChild(msg);
      }
    }, 500);
  }, 3000);
}

// ===================== التعامل مع روابط النافبار =====================
function handleNavbarLinks() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href') || '#';
      if (url === '#' || url === window.location.pathname.split("/").pop()) return; // رابط وهمي أو الصفحة الحالية
      showLoading();
      setTimeout(() => {
        window.location.href = url;
      }, 1000);
    });
  });
}

// ===================== التعامل مع زر "اشترك" في صفحة الاشتراك =====================
function handleSubscriptionButtons() {
  const subscribeButtons = document.querySelectorAll('.subscribe-btn');
  subscribeButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (isUserLoggedIn()) {
        showLoading();
        setTimeout(() => {
          hideLoading();
          showMessage("تم الاشتراك بنجاح!", "success");
          // يمكنك إضافة منطق إضافي هنا مثل تخزين الاشتراك في localStorage
        }, 1500);
      } else {
        window.location.href = "logtoWeb.html";
      }
    });
  });
}

// ===================== عند تحميل الصفحة =====================
window.addEventListener('DOMContentLoaded', () => {

  // معالجة شاشة الافتتاح
  handleOpeningAnimation();

  // لو الصفحة الرئيسية
  if (document.getElementById('anime-list')) {
    loadAnimesOnIndex();
  }

  // لو صفحة الحلقات
  if (document.getElementById('bannerContent')) {
    loadAnimeInfo();
  }

  // لو صفحة الاشتراك
  if (document.getElementById('subscriptionForm')) {
    handleSubscriptionForm();
  }

  // لو صفحة إنشاء الحساب
  if (document.getElementById('createAccountForm')) {
    handleCreateAccountForm();
  }

  // لو صفحة تسجيل الدخول
  if (document.getElementById('loginForm')) {
    handleLoginForm();
  }

  // لو صفحة الاشتراك مع خطط الاشتراك
  if (document.querySelector('.subscription-section')) {
    handleSubscriptionButtons();
  }

  // روابط النافبار مع شاشة التحميل
  handleNavbarLinks();
});
