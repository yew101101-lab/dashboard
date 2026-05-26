import React, { useState, useEffect } from 'react';
import { 
  WeatherWidget, 
  DateWidget, 
  LocationWidget, 
  ProfileWidget, 
  LogoutWidget,
  QuoteWidget,
  FocusTimerWidget,
  DDayWidget,
  IdeaPadWidget,
  TodayFocusWidget,
  MoodWidget,
  TodayTodoWidget
} from './components/DashboardWidgets';
import { Cpu, Wifi } from 'lucide-react';
import GlassCard from './components/GlassCard';
import './App.css';

// 데스크탑 전용 보너스 위젯: 시스템 모니터링 (할 일 목록은 공용 '오늘 할 일'로 대체)
function DesktopSystemMonitor() {
  const [cpuLoad, setCpuLoad] = useState(24);
  const [ramUsage, setRamUsage] = useState(48);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(Math.floor(Math.random() * 25) + 15); // 15% ~ 40%
      setRamUsage(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2% ~ +2%
        const next = prev + change;
        return next > 80 ? 78 : next < 40 ? 42 : next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="desktop-monitor-card">
      <div className="monitor-header">
        <Cpu size={20} className="monitor-header-icon" />
        <span className="monitor-header-title">시스템 리소스 모니터</span>
      </div>
      <div className="monitor-body">
        <div className="monitor-item">
          <div className="monitor-info">
            <span className="monitor-label">CPU 사용량</span>
            <span className="monitor-value">{cpuLoad}%</span>
          </div>
          <div className="monitor-bar-bg">
            <div className="monitor-bar-fill fill-cpu" style={{ width: `${cpuLoad}%` }}></div>
          </div>
        </div>
        
        <div className="monitor-item">
          <div className="monitor-info">
            <span className="monitor-label">RAM 점유율</span>
            <span className="monitor-value">{ramUsage}%</span>
          </div>
          <div className="monitor-bar-bg">
            <div className="monitor-bar-fill fill-ram" style={{ width: `${ramUsage}%` }}></div>
          </div>
        </div>

        <div className="monitor-status">
          <span className="status-indicator online"></span>
          <Wifi size={14} className="status-icon" />
          <span className="status-text">네트워크 온라인 (Latency: 14ms)</span>
        </div>
      </div>
    </GlassCard>
  );
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="login-screen-container">
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-blob blob-cyan"></div>
        <div className="aurora-blob blob-pink"></div>
        <div className="aurora-blob blob-yellow"></div>
      </div>
      
      <GlassCard className="login-card">
        <h2 className="login-title">Glassmorphism Dashboard</h2>
        <p className="login-subtitle">이름을 입력하고 대시보드를 시작해 보세요.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" 
            placeholder="이름을 입력해 주세요" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            maxLength={10}
            required
            autoFocus
          />
          <button type="submit" className="login-submit-btn">
            시작하기
          </button>
        </form>
      </GlassCard>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('dashboard_is_logged_in') === 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('dashboard_user_name') || '홍길동님';
  });

  const handleLogin = (name) => {
    const formattedName = name.endsWith('님') ? name : `${name}님`;
    localStorage.setItem('dashboard_is_logged_in', 'true');
    localStorage.setItem('dashboard_user_name', formattedName);
    setUserName(formattedName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_is_logged_in');
    localStorage.removeItem('dashboard_user_name');
    setIsLoggedIn(false);
  };

  const handleNameChange = (newName) => {
    localStorage.setItem('dashboard_user_name', newName);
    setUserName(newName);
  };

  const [apiKey] = useState(
    import.meta.env.VITE_OPENWEATHER_API_KEY || 
    localStorage.getItem('openweather_api_key') || 
    ''
  );
  
  // Geolocation & Weather Data States
  const [weather, setWeather] = useState({
    temp: 25,
    status: '맑음',
    desc: 'F12 콘솔의 안내에 따라 API Key를 등록하면 실시간 날씨를 볼 수 있습니다.',
    iconColor: '#eea133',
    isLive: false
  });
  const [locationName, setLocationName] = useState('경기도 수원시');
  const [loading, setLoading] = useState(false);

  // Gemini 2.5 API & Quote Shared States
  const [quote, setQuote] = useState({
    text: '가장 위대한 영광은 한 번도 넘어지지 않는 것이 아니라 넘어질 때마다 다시 일어서는 것이다.',
    author: '넬슨 만델라'
  });
  const [quoteAnimate, setQuoteAnimate] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  // Gemini API 호출 및 맞춤형 명언 추천
  const fetchGeminiQuote = async (userInput) => {
    if (!userInput || !userInput.trim()) return;

    const geminiKey = 
      import.meta.env.VITE_GEMINI_API_KEY || 
      localStorage.getItem('gemini_api_key') || 
      '';
    if (!geminiKey) {
      console.warn('⚠️ [Gemini API] API Key가 등록되지 않았습니다. 내장 명언 목록에서 추천 처리합니다.');
      console.log('%c[Gemini API 등록 가이드]', 'color: #8b5cf6; font-weight: bold;');
      console.log('실시간 AI 명언 생성 기능을 이용하려면 브라우저 콘솔에서 아래 명령어를 실행해 주세요:');
      console.log('%clocalStorage.setItem("gemini_api_key", "여기에_GEMINI_API_KEY")', 'color: #a78bfa; font-family: monospace;');

      setQuoteAnimate(true);
      setTimeout(() => {
        const fallbackQuotes = [
          { text: "가장 위대한 영광은 한 번도 넘어지지 않는 것이 아니라 넘어질 때마다 다시 일어서는 것이다.", author: "넬슨 만델라" },
          { text: "인생에서 가장 큰 실수는 실수할까 봐 계속 두려워하는 것이다.", author: "엘버트 허버드" },
          { text: "오늘 할 수 있는 일에 온 힘을 다해라. 그러면 내일은 한 걸음 더 나아가 있을 것이다.", author: "아이작 뉴턴" },
          { text: "도전은 인생을 흥미롭게 만들며, 도전의 극복은 인생을 의미 있게 만든다.", author: "조슈아 J. 마린" },
          { text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.", author: "헨리 포드" },
          { text: "어제보다 나은 내일을 만드는 유일한 방법은 오늘 최선을 다하는 것이다.", author: "미상" }
        ];
        const nextIdx = Math.floor(Math.random() * fallbackQuotes.length);
        setQuote(fallbackQuotes[nextIdx]);
        setQuoteAnimate(false);
      }, 300);
      return;
    }

    setGeminiLoading(true);
    setQuoteAnimate(true);

    const promptText = `사용자의 핵심 일과 혹은 감정 상태: "${userInput}". 이 입력에 아주 잘 어울리고 동기를 부여하는 따뜻한 명언이나 격언 한 개를 추천하거나 직접 작성해줘.`;

    console.log('🌐 [Gemini API] Request Data:', {
      model: 'gemini-1.5-flash',
      prompt: promptText,
      apiKeyMasked: geminiKey ? `${geminiKey.substring(0, 5)}***${geminiKey.slice(-4)}` : 'None',
      endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=***`
    });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: promptText
              }]
            }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  text: { type: "STRING" },
                  author: { type: "STRING" }
                },
                required: ["text", "author"]
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP 에러! 상태코드: ${response.status}`);
      }

      const resData = await response.json();
      console.log('✅ [Gemini API] Response Raw:', resData);

      const generatedText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsedQuote = JSON.parse(generatedText.trim());

      if (parsedQuote.text && parsedQuote.author) {
        setQuote({
          text: parsedQuote.text,
          author: parsedQuote.author
        });
      } else {
        throw new Error('응답에 text 또는 author 필드가 없습니다.');
      }
    } catch (error) {
      console.error('❌ [Gemini API] Error:', error);
      const fallbackQuotes = [
        { text: "실패는 성공의 어머니이다. 실패에서 배우면 그것은 성공의 발판이 된다.", author: "토마스 에디슨" },
        { text: "행동은 모든 성공의 기초이다.", author: "파블로 피카소" },
        { text: "인생은 우리가 만드는 것이다. 언제나 그래왔고, 앞으로도 그럴 것이다.", author: "그랜마 모지스" }
      ];
      const nextIdx = Math.floor(Math.random() * fallbackQuotes.length);
      setQuote(fallbackQuotes[nextIdx]);
    } finally {
      setQuoteAnimate(false);
      setGeminiLoading(false);
    }
  };


  // 영문 도시명 한글 매핑 딕셔너리
  const cityKoreanMap = {
    'Seoul': '서울특별시',
    'Suwon': '경기도 수원시',
    'Suwon-si': '경기도 수원시',
    'Incheon': '인천광역시',
    'Busan': '부산광역시',
    'Daegu': '대구광역시',
    'Daejeon': '대전광역시',
    'Gwangju': '광주광역시',
    'Ulsan': '울산광역시',
    'Sejong': '세종특별자치시',
    'Gyeonggi-do': '경기도',
    'Jeju': '제주특별자치도'
  };

  // API 호출 및 날씨 정보 로드 함수
  const fetchWeatherData = async (lat, lon, keyToUse) => {
    if (!keyToUse) return;
    setLoading(true);

    // API 요청 로그 기록
    console.log('🌐 [OpenWeather API] Request Data:', {
      latitude: lat,
      longitude: lon,
      apiKeyMasked: keyToUse ? `${keyToUse.substring(0, 5)}***${keyToUse.slice(-4)}` : 'None',
      endpoint: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=***&units=metric&lang=kr`
    });

    try {
      // 1. 날씨 정보 fetch
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyToUse}&units=metric&lang=kr`
      );
      if (!weatherResponse.ok) {
        throw new Error('날씨 API Key가 유효하지 않거나 네트워크 에러 발생');
      }
      const weatherData = await weatherResponse.json();
      console.log('✅ [OpenWeather API] Weather Response Raw:', weatherData);

      // 2. 역지오코딩(Reverse Geocoding) fetch를 통한 한글 도시명 조회
      let mappedName = '알 수 없는 지역';
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${keyToUse}`
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          console.log('✅ [OpenWeather API] Geo Response Raw:', geoData);
          if (geoData && geoData.length > 0) {
            const geoItem = geoData[0];
            if (geoItem.local_names && geoItem.local_names.ko) {
              mappedName = geoItem.local_names.ko;
              if (!mappedName.endsWith('시') && !mappedName.endsWith('도') && !mappedName.endsWith('군') && !mappedName.endsWith('구')) {
                const suffixMap = {
                  '서울': '서울특별시',
                  '인천': '인천광역시',
                  '부산': '부산광역시',
                  '대구': '대구광역시',
                  '대전': '대전광역시',
                  '광주': '광주광역시',
                  '울산': '울산광역시',
                  '세종': '세종특별자치시',
                  '수원': '경기도 수원시',
                  '성남': '경기도 성남시',
                  '고양': '경기도 고양시',
                  '용인': '경기도 용인시',
                  '부천': '경기도 부천시',
                  '안산': '경기도 안산시',
                  '남양주': '경기도 남양주시',
                  '안양': '경기도 안양시',
                  '화성': '경기도 화성시',
                  '평택': '경기도 평택시'
                };
                mappedName = suffixMap[mappedName] || mappedName;
              }
            } else {
              const rawName = geoItem.name;
              const cleanName = rawName.replace('si', '').replace('si-do', '').trim();
              mappedName = cityKoreanMap[rawName] || cityKoreanMap[cleanName] || `${rawName} (실시간)`;
            }
          }
        }
      } catch (geoErr) {
        console.warn('역지오코딩 API 호출 실패, 기본 날씨 데이터 기반 한글화 처리:', geoErr);
        const rawName = weatherData.name;
        const cleanName = rawName.replace('si', '').replace('gun', '').trim();
        mappedName = cityKoreanMap[rawName] || cityKoreanMap[cleanName] || `${rawName} (실시간)`;
      }

      // 기온 및 상태 갱신
      const temp = Math.round(weatherData.main.temp);
      const status = weatherData.weather[0].main;
      const desc = weatherData.weather[0].description;
      
      // 날씨 상태별 아이콘 컬러 매핑
      let iconColor = '#eea133';
      if (status === 'Rain' || status === 'Drizzle' || status === 'Thunderstorm') {
        iconColor = '#60a5fa';
      } else if (status === 'Clouds') {
        iconColor = '#94a3b8';
      } else if (status === 'Snow') {
        iconColor = '#e2e8f0';
      }

      // 날씨 심볼 한글화
      const statusMap = {
        'Clear': '맑음',
        'Clouds': '흐림',
        'Rain': '비',
        'Drizzle': '이슬비',
        'Thunderstorm': '뇌우',
        'Snow': '눈',
        'Mist': '안개',
        'Smoke': '연기',
        'Haze': '실안개',
        'Dust': '황사',
        'Fog': '짙은안개',
        'Sand': '모래',
        'Ash': '화산재',
        'Squall': '돌풍',
        'Tornado': '토네이도'
      };

      setWeather({
        temp,
        status: statusMap[status] || status,
        desc: desc.charAt(0).toUpperCase() + desc.slice(1),
        iconColor,
        isLive: true
      });

      setLocationName(mappedName);
    } catch (err) {
      console.error(err);
      setWeather(prev => ({
        ...prev,
        isLive: false,
        desc: 'API 연동 에러로 데모 모드로 작동 중입니다.'
      }));
    } finally {
      setLoading(false);
    }
  };

  // 실시간 위치 데이터 요청 및 API Fetch 연동
  const loadLiveLocationAndWeather = (keyToUse) => {
    if (!keyToUse) {
      setWeather({
        temp: 25,
        status: '맑음',
        desc: 'F12 콘솔의 설정 안내에 따라 API Key를 등록하면 실시간 날씨를 볼 수 있습니다.',
        iconColor: '#eea133',
        isLive: false
      });
      setLocationName('경기도 수원시');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude, keyToUse);
        },
        (error) => {
          console.warn('Geolocation 획득 실패, 기본 좌표로 날씨 호출:', error.message);
          fetchWeatherData(37.2636, 127.0286, keyToUse);
        }
      );
    } else {
      console.warn('이 브라우저는 Geolocation을 지원하지 않습니다.');
      fetchWeatherData(37.2636, 127.0286, keyToUse);
    }
  };

  useEffect(() => {
    // 개발자 콘솔 가이드 출력
    console.log('%c📢 [API 사용 가이드]', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
    console.log('실시간 위치 기반 날씨 및 Gemini AI 명언 추천 기능을 사용하려면 프로젝트 루트의 .env 파일에 키를 작성하거나, 브라우저 콘솔에서 아래 명령어를 실행해 주세요.');
    console.log('1. OpenWeather API Key 설정:');
    console.log('%c- .env 파일: VITE_OPENWEATHER_API_KEY=API_KEY', 'color: #10b981; font-family: monospace;');
    console.log('%c- 브라우저 콘솔: localStorage.setItem("openweather_api_key", "API_KEY")', 'color: #10b981; font-family: monospace;');
    console.log('2. Gemini API Key 설정:');
    console.log('%c- .env 파일: VITE_GEMINI_API_KEY=API_KEY', 'color: #a78bfa; font-family: monospace;');
    console.log('%c- 브라우저 콘솔: localStorage.setItem("gemini_api_key", "API_KEY")', 'color: #a78bfa; font-family: monospace;');
    console.log('키 설정 완료 후 페이지를 새로고침(F5)하시면 실시간 정보가 반영됩니다.');

    loadLiveLocationAndWeather(apiKey);
  }, [apiKey]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '좋은 아침입니다! ☀️';
    if (hour >= 12 && hour < 18) return '즐거운 오후 보내세요! ☕';
    if (hour >= 18 && hour < 22) return '오늘 하루 수고 많으셨습니다! 🌙';
    return '평온한 밤 되세요. 💤';
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-blob blob-cyan"></div>
        <div className="aurora-blob blob-pink"></div>
        <div className="aurora-blob blob-yellow"></div>
      </div>

      <div className="app-container">
        <header className="app-header">
          <div className="header-greeting">{getGreeting()}</div>
          <h1 className="header-title">Glassmorphism Dashboard</h1>
          <p className="header-subtitle">
            각각의 위젯 카드가 직관적인 세로 정렬 구조로 배치된 반응형 대시보드
          </p>
        </header>

        {/* 메인 대시보드 레이아웃 (세로 정렬 구조 하단에 신규 위젯 추가) */}
        <main className="dashboard-grid">
          {/* 1. 기본 피그마 정의 위젯군 */}
          <div className="widget-wrapper location-area">
            <LocationWidget text={locationName} loading={loading} />
          </div>

          <div className="widget-wrapper weather-area">
            <WeatherWidget weather={weather} loading={loading} />
          </div>

          <div className="widget-wrapper date-area">
            <DateWidget />
          </div>
          
          <div className="widget-wrapper profile-area">
            <ProfileWidget userName={userName} onNameChange={handleNameChange} />
          </div>
          
          <div className="widget-wrapper logout-area">
            <LogoutWidget onLogout={handleLogout} />
          </div>

          {/* 2. 신규 중간 배치 위젯군 (오늘의 명언, Focus Timer) */}
          <div className="widget-wrapper quote-area">
            <QuoteWidget 
              quote={quote} 
              animate={quoteAnimate} 
              onRefresh={() => fetchGeminiQuote('성공, 노력, 끈기')} 
            />
          </div>

          <div className="widget-wrapper focus-timer-area">
            <FocusTimerWidget />
          </div>

          {/* 3. 신규 추가 4종 위젯군 */}
          <div className="widget-wrapper dday-area">
            <DDayWidget />
          </div>

          <div className="widget-wrapper today-focus-area">
            <TodayFocusWidget 
              onFocusSubmit={fetchGeminiQuote} 
              geminiLoading={geminiLoading} 
            />
          </div>

          <div className="widget-wrapper mood-area">
            <MoodWidget />
          </div>

          <div className="widget-wrapper today-todo-area">
            <TodayTodoWidget />
          </div>

          {/* 4. 아이디어 대시패드 위젯 */}
          <div className="widget-wrapper ideapad-area">
            <IdeaPadWidget />
          </div>

          {/* 3. 데스크탑/태블릿용 보너스 리소스 모니터 위젯 */}
          <div className="widget-wrapper desktop-widget monitor-area">
            <DesktopSystemMonitor />
          </div>
        </main>

        <footer className="app-footer">
          <p>© 2026 Glassmorphism Dashboard. Crafted with React, Vite & Vanilla CSS.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
