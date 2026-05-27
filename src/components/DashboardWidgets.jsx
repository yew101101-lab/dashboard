import React, { useState, useEffect } from 'react';
import { CloudSun, Calendar, MapPin, User, LogOut, Check, PiggyBank, Target, Flame, Smile, Compass, Plus, Trash2, CheckSquare, Quote, Play, Pause, RotateCcw, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';
import './DashboardWidgets.css';

// ==========================================
// 1. 기존 피그마 위젯군
// ==========================================

export function WeatherWidget({ weather, loading }) {
  const defaultWeather = {
    temp: 25,
    status: '맑음',
    desc: 'F12 콘솔의 안내에 따라 API Key를 등록하면 실시간 날씨를 볼 수 있습니다.',
    iconColor: '#eea133'
  };

  const current = weather || defaultWeather;

  return (
    <GlassCard className="widget-card weather-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': current.iconColor }}>
          <CloudSun size={20} className={loading ? "animated-icon spinning" : "animated-icon"} />
        </div>
        <span className="widget-title">
          {loading ? "불러오는 중..." : `${current.temp}℃ ${current.status}`}
        </span>
      </div>
      <p className="widget-subtext">
        {loading ? "최신 날씨 정보를 갱신하고 있습니다." : current.desc}
      </p>
      <div className="widget-hint">
        {current.isLive ? "실시간 날씨 동기화 됨" : "데모 날씨 데이터"}
      </div>
    </GlassCard>
  );
}

export function DateWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 ${weekday}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <GlassCard className="widget-card date-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#7c3aed' }}>
          <Calendar size={20} />
        </div>
        <span className="widget-title">{formatDate(time)}</span>
      </div>
      <p className="widget-time">{formatTime(time)}</p>
      <div className="widget-hint">실시간 서버 동기화 완료</div>
    </GlassCard>
  );
}

export function LocationWidget({ text, loading }) {
  const [copied, setCopied] = useState(false);
  const locationText = text || "경기도 수원시";

  const copyLocation = () => {
    navigator.clipboard.writeText(locationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="widget-card location-widget" onClick={copyLocation}>
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#0284c7' }}>
          <MapPin size={20} />
        </div>
        <span className="widget-title">
          {loading ? "위치 조회 중..." : locationText}
        </span>
      </div>
      <p className="widget-subtext">
        {loading ? "현재 위치를 확인하고 있습니다." : "주소지 복사하기"}
      </p>
      <div className="widget-hint-action">
        {copied ? (
          <span className="copied-text"><Check size={14} /> 복사 완료</span>
        ) : (
          <span>{loading ? "잠시만 기다려주세요" : "클릭하여 클립보드에 복사"}</span>
        )}
      </div>
    </GlassCard>
  );
}

export function ProfileWidget({ userName, onNameChange }) {
  const name = userName || '홍길동님';
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  useEffect(() => {
    setEditName(name);
  }, [name]);

  const startEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (editName.trim()) {
      const nextName = editName.endsWith('님') ? editName : `${editName}님`;
      if (onNameChange) {
        onNameChange(nextName);
      }
    }
    setIsEditing(false);
  };

  return (
    <GlassCard className="widget-card profile-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#38bdf8' }}>
          <User size={20} />
        </div>
        {isEditing ? (
          <form onSubmit={saveEdit} className="profile-edit-form" onClick={e => e.stopPropagation()}>
            <input 
              type="text" 
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="profile-input"
              maxLength={10}
              autoFocus
              onBlur={saveEdit}
            />
          </form>
        ) : (
          <span className="widget-title" onClick={startEdit}>{name}</span>
        )}
      </div>
      <p className="widget-subtext" onClick={startEdit}>
        {isEditing ? '엔터를 눌러 저장' : '클릭하여 이름 수정'}
      </p>
      <div className="widget-badge">Premium</div>
    </GlassCard>
  );
}

export function LogoutWidget({ onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    if (onLogout) {
      onLogout();
    }
    setShowConfirm(false);
  };

  return (
    <GlassCard 
      className={`widget-card logout-widget ${showConfirm ? 'confirm-mode' : ''}`} 
      onClick={handleLogoutClick}
    >
      {showConfirm ? (
        <div className="logout-confirm-box" onClick={e => e.stopPropagation()}>
          <p className="logout-confirm-title">로그아웃 하시겠습니까?</p>
          <div className="logout-confirm-buttons">
            <button className="btn-confirm-yes" onClick={handleConfirm}>확인</button>
            <button className="btn-confirm-no" onClick={handleCancel}>취소</button>
          </div>
        </div>
      ) : (
        <>
          <div className="widget-header">
            <div className="widget-icon-box" style={{ '--icon-color': '#ef4444' }}>
              <LogOut size={20} />
            </div>
            <span className="widget-title text-danger">로그아웃</span>
          </div>
          <p className="widget-subtext">세션 안전하게 종료</p>
          <div className="widget-hint">클릭하여 세션 아웃</div>
        </>
      )}
    </GlassCard>
  );
}

// ==========================================
// 2. 신규 4종 위젯군 (하단 배치용)
// ==========================================

// A. 디데이 플래너 위젯 (최대 3개 등록 가능, LocalStorage 연동)
export function DDayWidget() {
  const [ddays, setDdays] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_ddays');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isValid = parsed.every(item => item && typeof item === 'object' && 'id' in item && 'title' in item && 'date' in item);
          if (isValid) return parsed;
        }
      }
    } catch (e) {
      console.error('LocalStorage dashboard_ddays parsing error, falling back to default:', e);
    }
    return [
      { id: 1, title: '저축 목표 달성 기한', date: '2026-12-31' },
      { id: 2, title: '포트폴리오 완성 기한', date: '2026-08-31' },
      { id: 3, title: '자격증 취득 목표일', date: '2026-10-31' }
    ];
  });
  
  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [animating, setAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboard_ddays', JSON.stringify(ddays));
    if (currentIndex >= ddays.length) {
      setCurrentIndex(Math.max(0, ddays.length - 1));
    }
  }, [ddays, currentIndex]);

  // 4초마다 자동 슬라이드 (Auto-play, 마우스 호버 시 일시정지)
  useEffect(() => {
    if (ddays.length <= 1 || isAdding || isHovered) return;

    const interval = setInterval(() => {
      if (animating) return;
      setSlideDirection('next');
      setAnimating(true);
      setCurrentIndex((prev) => {
        const nextIdx = prev === ddays.length - 1 ? 0 : prev + 1;
        return nextIdx >= ddays.length ? 0 : nextIdx;
      });
      setTimeout(() => setAnimating(false), 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [ddays, currentIndex, isAdding, isHovered, animating]);

  const calculateDDay = (dateStr) => {
    try {
      if (!dateStr) return 'D-?';
      const target = new Date(dateStr);
      if (isNaN(target.getTime())) return 'D-?';

      const today = new Date();
      target.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'D-Day';
      return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    } catch (err) {
      return 'D-?';
    }
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (animating || ddays.length <= 1) return;
    setSlideDirection('prev');
    setAnimating(true);
    setCurrentIndex((prev) => {
      const nextIdx = prev === 0 ? ddays.length - 1 : prev - 1;
      return nextIdx >= ddays.length ? 0 : nextIdx;
    });
    setTimeout(() => setAnimating(false), 300);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (animating || ddays.length <= 1) return;
    setSlideDirection('next');
    setAnimating(true);
    setCurrentIndex((prev) => {
      const nextIdx = prev === ddays.length - 1 ? 0 : prev + 1;
      return nextIdx >= ddays.length ? 0 : nextIdx;
    });
    setTimeout(() => setAnimating(false), 300);
  };

  const handleDotClick = (idx, e) => {
    if (e) e.stopPropagation();
    if (idx === currentIndex || animating) return;
    setSlideDirection(idx > currentIndex ? 'next' : 'prev');
    setAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setAnimating(false), 300);
  };

  const handleAddDDay = (e) => {
    e.preventDefault();
    if (!titleInput.trim() || !dateInput) return;
    if (ddays.length >= 3) {
      alert('D-Day는 최대 3개까지만 등록할 수 있습니다.');
      return;
    }
    
    const newDDay = {
      id: Date.now(),
      title: titleInput.trim(),
      date: dateInput
    };
    
    const updated = [...ddays, newDDay];
    setDdays(updated);
    setTitleInput('');
    setDateInput('');
    setIsAdding(false);
    setCurrentIndex(updated.length - 1);
  };

  const handleDeleteDDay = (id, e) => {
    e.stopPropagation();
    const filtered = ddays.filter(item => item.id !== id);
    setDdays(filtered);
    
    setCurrentIndex((prev) => {
      if (filtered.length === 0) return 0;
      if (prev >= filtered.length) return filtered.length - 1;
      return prev;
    });
  };

  return (
    <GlassCard 
      className="widget-card dday-widget"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#10b981' }}>
          <PiggyBank size={20} />
        </div>
        <span className="widget-title">디데이 스케줄러 ({ddays.length}/3)</span>
        {!isAdding && ddays.length < 3 && (
          <button className="dday-add-shortcut-btn" onClick={(e) => { e.stopPropagation(); setIsAdding(true); }} title="D-Day 추가">
            <Plus size={14} />
          </button>
        )}
      </div>

      <div className="dday-widget-body">
        {isAdding ? (
          <form onSubmit={handleAddDDay} className="dday-edit-form" onClick={e => e.stopPropagation()}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="목표나 일정 이름"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                className="dday-input"
                maxLength={20}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <input 
                type="date" 
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="dday-input"
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-dday-save">추가</button>
              <button type="button" className="btn-dday-cancel" onClick={() => setIsAdding(false)}>취소</button>
            </div>
          </form>
        ) : (
          <div className="dday-slider-container">
            {ddays.length > 0 ? (
              <>
                <div className="dday-slider-wrapper">
                  <div className={`dday-slide-item ${animating ? `slide-animating-${slideDirection}` : ''}`}>
                    {ddays[currentIndex] && (
                      <div className="dday-slide-content">
                        <span className="dday-badge-large">{calculateDDay(ddays[currentIndex].date)}</span>
                        <div className="dday-slide-details">
                          <span className="dday-slide-title">{ddays[currentIndex].title}</span>
                          <span className="dday-slide-date">{ddays[currentIndex].date}</span>
                        </div>
                      </div>
                    )}
                    
                    {ddays[currentIndex] && (
                      <button className="dday-slide-delete-btn" onClick={(e) => handleDeleteDDay(ddays[currentIndex].id, e)} title="D-Day 삭제">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="dday-slider-controls">
                  {ddays.length > 1 && (
                    <button className="slider-control-btn prev-btn" onClick={handlePrev} title="이전 목표">
                      <ChevronLeft size={14} />
                    </button>
                  )}
                  
                  <div className="dday-indicators">
                    {ddays.map((item, idx) => (
                      <span 
                        key={item.id} 
                        className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={(e) => handleDotClick(idx, e)}
                        title={`${idx + 1}번째 목표로 이동`}
                      />
                    ))}
                  </div>

                  {ddays.length > 1 && (
                    <button className="slider-control-btn next-btn" onClick={handleNext} title="다음 목표">
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="dday-empty-slider">
                <p className="dday-empty-msg">등록된 디데이가 없습니다.</p>
                <button className="btn-dday-add-trigger" onClick={() => setIsAdding(true)}>
                  <Plus size={13} /> D-Day 추가하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// B. Today Focus 위젯
export function TodayFocusWidget({ onFocusSubmit, geminiLoading }) {
  const [focus, setFocus] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    setFocus(inputVal.trim());
    setIsRegistered(true);

    if (onFocusSubmit) {
      await onFocusSubmit(inputVal.trim());
    }
  };

  const handleReset = () => {
    setInputVal('');
    setFocus('');
    setIsRegistered(false);
  };

  return (
    <GlassCard className="widget-card today-focus-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#f59e0b' }}>
          <Target size={20} />
        </div>
        <span className="widget-title">Today Focus</span>
      </div>
      
      {isRegistered ? (
        <div className="focus-registered-box">
          <p className="focus-highlight-text">“{focus}”</p>
          <button className="btn-focus-reset" onClick={handleReset} disabled={geminiLoading}>
            {geminiLoading ? 'AI 생성 중...' : '변경하기'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="focus-input-form" onClick={e => e.stopPropagation()}>
          <p className="focus-guide">오늘 단 하나, 집중할 핵심 목표나 감정</p>
          <div className="focus-input-row">
            <input 
              type="text" 
              placeholder="예) 피그마 컴포넌트 마감..." 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="focus-input"
              maxLength={25}
              required
              disabled={geminiLoading}
            />
            <button type="submit" className="focus-submit-btn" disabled={geminiLoading}>
              {geminiLoading ? '로딩...' : '등록'}
            </button>
          </div>
        </form>
      )}
      <div className="widget-hint">
        {geminiLoading ? "🤖 AI가 어울리는 명언을 생성하고 있습니다..." : (isRegistered ? "🔥 오늘 꼭 달성하세요!" : "목표 등록 대기 중")}
      </div>
    </GlassCard>
  );
}

// C. 오늘의 기분 위젯
export function MoodWidget({ onMoodSelect, moodLoading }) {
  const [activeMood, setActiveMood] = useState(() => {
    return localStorage.getItem('dashboard_active_mood') || null;
  }); // 'calm', 'joy', 'flow'

  const moods = [
    { key: 'calm', label: '평온', icon: Compass, color: '#34d399', desc: '차분하게 중심을 잡은 상태 🧘‍♂️' },
    { key: 'joy', label: '기쁨', icon: Smile, color: '#fbbf24', desc: '에너지가 가득하고 즐거운 상태 😊' },
    { key: 'flow', label: '몰입', icon: Flame, color: '#f87171', desc: '시간 가는 줄 모르고 집중하는 상태 🔥' }
  ];

  const handleMoodSelect = async (mood, e) => {
    e.stopPropagation();
    setActiveMood(mood.key);
    localStorage.setItem('dashboard_active_mood', mood.key);
    
    if (onMoodSelect) {
      await onMoodSelect(mood.label);
    }
  };

  const activeMoodInfo = moods.find(m => m.key === activeMood);

  return (
    <GlassCard 
      className={`widget-card mood-widget ${activeMood ? `mood-active-${activeMood}` : ''}`}
      style={activeMoodInfo ? { borderColor: activeMoodInfo.color, boxShadow: `0 8px 32px 0 ${activeMoodInfo.color}1e` } : {}}
    >
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': activeMoodInfo ? activeMoodInfo.color : '#e2e8f0' }}>
          {activeMoodInfo ? <activeMoodInfo.icon size={20} className={moodLoading ? "animated-icon spinning" : "animated-icon"} /> : <Smile size={20} />}
        </div>
        <span className="widget-title">오늘의 기분</span>
      </div>

      <div className="mood-buttons-row">
        {moods.map(mood => {
          const MoodIcon = mood.icon;
          return (
            <button
              key={mood.key}
              onClick={(e) => handleMoodSelect(mood, e)}
              className={`btn-mood-select ${activeMood === mood.key ? 'active' : ''}`}
              style={{ '--mood-color': mood.color }}
              disabled={moodLoading}
            >
              <MoodIcon size={14} />
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
      <p className="widget-subtext">
        {moodLoading ? "🤖 AI가 기분에 어울리는 배경 컬러 그라디언트를 생성 중..." : (activeMoodInfo ? activeMoodInfo.desc : "지금 내 감정 상태는 어떠한가요?")}
      </p>
    </GlassCard>
  );
}

// D. 오늘 할 일 위젯
export function TodayTodoWidget() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('dashboard_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '반응형 세로 스택 레이아웃 검증', completed: true },
      { id: 2, text: '4종 위젯 기획 상세 동작 확인', completed: false }
    ];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('dashboard_todos', JSON.stringify(todos));
  }, [todos]);

  const toggleTodo = (id, e) => {
    e.stopPropagation();
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id, e) => {
    e.stopPropagation();
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputValue.trim(), completed: false }
    ]);
    setInputValue('');
  };

  return (
    <GlassCard className="widget-card today-todo-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#f472b6' }}>
          <CheckSquare size={20} />
        </div>
        <span className="widget-title">오늘 할 일</span>
      </div>
      
      <div className="todo-widget-body">
        <ul className="todo-widget-list">
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className={`todo-widget-item ${todo.completed ? 'completed' : ''}`}
              onClick={(e) => toggleTodo(todo.id, e)}
            >
              <div className="todo-widget-checkbox">
                {todo.completed && <Check size={12} />}
              </div>
              <span className="todo-widget-text">{todo.text}</span>
              <button className="todo-widget-delete-btn" onClick={(e) => deleteTodo(todo.id, e)}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <li className="todo-widget-empty">오늘 남은 일정이 없습니다! 🎉</li>
          )}
        </ul>
        <form onSubmit={addTodo} className="todo-widget-form" onClick={e => e.stopPropagation()}>
          <input 
            type="text" 
            placeholder="할 일 추가..." 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="todo-widget-input"
            maxLength={30}
            required
          />
          <button type="submit" className="todo-widget-add-btn">
            <Plus size={14} />
          </button>
        </form>
      </div>
    </GlassCard>
  );
}

// ==========================================
// 3. 신규 위젯 2종 (오늘의 명언, Focus Timer)
// ==========================================

const quoteList = [
  { text: "가장 위대한 영광은 한 번도 넘어지지 않는 것이 아니라 넘어질 때마다 다시 일어서는 것이다.", author: "넬슨 만델라" },
  { text: "인생에서 가장 큰 실수는 실수할까 봐 계속 두려워하는 것이다.", author: "엘버트 허버드" },
  { text: "오늘 할 수 있는 일에 온 힘을 다해라. 그러면 내일은 한 걸음 더 나아가 있을 것이다.", author: "아이작 뉴턴" },
  { text: "도전은 인생을 흥미롭게 만들며, 도전의 극복은 인생을 의미 있게 만든다.", author: "조슈아 J. 마린" },
  { text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.", author: "헨리 포드" },
  { text: "행복은 이미 만들어져 있는 것이 아니다. 그것은 당신의 행동으로부터 나온다.", author: "달라이 라마" },
  { text: "끝을 시작하는 유일한 방법은 시작하는 것이다.", author: "샐리 켐프턴" },
  { text: "어제와 똑같은 오늘을 살면서 다른 내일을 기대하는 것은 정신병 초기증세다.", author: "알베르트 아인슈타인" }
];

export function QuoteWidget({ quote, animate, onRefresh }) {
  const defaultQuote = {
    text: "가장 위대한 영광은 한 번도 넘어지지 않는 것이 아니라 넘어질 때마다 다시 일어서는 것이다.",
    author: "넬슨 만델라"
  };
  const currentQuote = quote || defaultQuote;

  return (
    <GlassCard className="widget-card quote-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#e879f9' }}>
          <Quote size={18} />
        </div>
        <span className="widget-title">오늘의 명언</span>
        <button className="quote-refresh-btn" onClick={onRefresh} title="새로운 명언 보기">
          <RefreshCw size={14} className={animate ? "spinning" : ""} />
        </button>
      </div>
      <div className={`quote-body ${animate ? 'fade-out' : 'fade-in'}`}>
        <p className="quote-text">“{currentQuote.text}”</p>
        <span className="quote-author">- {currentQuote.author}</span>
      </div>
    </GlassCard>
  );
}

export function FocusTimerWidget() {
  const DEFAULT_TIME = 25 * 60; // 25분
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        alert('집중 시간이 끝났습니다! 5분 동안 휴식을 취해보세요. ☕');
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        alert('휴식 시간이 끝났습니다! 다시 집중에 몰입해봅시다. 🔥');
        setMode('focus');
        setTimeLeft(DEFAULT_TIME);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = (e) => {
    e.stopPropagation();
    setIsActive(!isActive);
  };

  const resetTimer = (e) => {
    e.stopPropagation();
    setIsActive(false);
    setMode('focus');
    setTimeLeft(DEFAULT_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? DEFAULT_TIME : 5 * 60;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <GlassCard className={`widget-card focus-timer-widget ${isActive ? 'timer-running' : ''} timer-mode-${mode}`}>
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': mode === 'focus' ? '#f87171' : '#60a5fa' }}>
          <Target size={18} className={isActive ? 'pulse-icon' : ''} />
        </div>
        <span className="widget-title">
          {mode === 'focus' ? '집중 세션 흐름' : '휴식 세션 흐름'}
        </span>
        <span className={`timer-mode-badge ${mode}`}>{mode === 'focus' ? 'Focus' : 'Break'}</span>
      </div>

      <div className="timer-display-box">
        <span className="timer-digits">{formatTime(timeLeft)}</span>
        <div className="timer-progress-track">
          <div className="timer-progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="timer-controls-row" onClick={e => e.stopPropagation()}>
        <button className={`btn-timer-action ${isActive ? 'btn-pause' : 'btn-play'}`} onClick={toggleTimer}>
          {isActive ? <Pause size={14} /> : <Play size={14} />}
          <span>{isActive ? '일시정지' : '시작'}</span>
        </button>
        <button className="btn-timer-reset" onClick={resetTimer}>
          <RotateCcw size={14} />
          <span>초기화</span>
        </button>
      </div>
    </GlassCard>
  );
}

// E. 아이디어 대시패드 위젯 (LocalStorage 연동)
export function IdeaPadWidget() {
  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem('dashboard_ideas');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '글래스모피즘 UI에 입자 애니메이션 입혀보기' }
    ];
  });
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    localStorage.setItem('dashboard_ideas', JSON.stringify(ideas));
  }, [ideas]);

  const handleAddIdea = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    const newIdea = {
      id: Date.now(),
      text: inputVal.trim()
    };
    
    setIdeas([...ideas, newIdea]);
    setInputVal('');
  };

  const handleDeleteIdea = (id, e) => {
    e.stopPropagation();
    setIdeas(ideas.filter(item => item.id !== id));
  };

  return (
    <GlassCard className="widget-card ideapad-widget">
      <div className="widget-header">
        <div className="widget-icon-box" style={{ '--icon-color': '#0284c7' }}>
          <Compass size={18} />
        </div>
        <span className="widget-title">아이디어 대시패드</span>
      </div>

      <div className="ideapad-body">
        <ul className="ideapad-list">
          {ideas.map(item => (
            <li key={item.id} className="ideapad-item">
              <span className="ideapad-text">💡 {item.text}</span>
              <button className="ideapad-delete-btn" onClick={(e) => handleDeleteIdea(item.id, e)}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
          {ideas.length === 0 && (
            <li className="ideapad-empty">떠오르는 아이디어를 기록해 보세요!</li>
          )}
        </ul>
        <form onSubmit={handleAddIdea} className="ideapad-form" onClick={e => e.stopPropagation()}>
          <input 
            type="text" 
            placeholder="새로운 아이디어 메모..." 
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="ideapad-input"
            maxLength={40}
            required
          />
          <button type="submit" className="ideapad-add-btn">
            <Plus size={14} />
          </button>
        </form>
      </div>
    </GlassCard>
  );
}

