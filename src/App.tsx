import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  color: string;
  size: number; // визуальный размер в px
  orbitRadius: number; // визуальный радиус орбиты в px
  realDiameter: number; // реальный диаметр в км
  realDistance: number; // расстояние от Солнца в млн км
  orbitalPeriod: number; // орбитальный период в земных днях
  speed: number; // скорость анимации (радиан/сек)
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    color: '#b5b5b5',
    size: 8,
    orbitRadius: 70,
    realDiameter: 4879,
    realDistance: 57.9,
    orbitalPeriod: 88,
    speed: 4.15,
    description: 'Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    color: '#e8cda0',
    size: 12,
    orbitRadius: 100,
    realDiameter: 12104,
    realDistance: 108.2,
    orbitalPeriod: 225,
    speed: 1.62,
    description: 'Самая горячая планета с плотной атмосферой из углекислого газа.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    color: '#4da6ff',
    size: 13,
    orbitRadius: 140,
    realDiameter: 12756,
    realDistance: 149.6,
    orbitalPeriod: 365,
    speed: 1.0,
    description: 'Наш дом! Единственная известная планета с жизнью.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    color: '#e57c4a',
    size: 10,
    orbitRadius: 180,
    realDiameter: 6792,
    realDistance: 227.9,
    orbitalPeriod: 687,
    speed: 0.53,
    description: 'Красная планета с самой высокой горой в Солнечной системе — Олимп.'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    color: '#c88b3a',
    size: 28,
    orbitRadius: 240,
    realDiameter: 142984,
    realDistance: 778.6,
    orbitalPeriod: 4333,
    speed: 0.084,
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    color: '#e8d590',
    size: 24,
    orbitRadius: 310,
    realDiameter: 120536,
    realDistance: 1433.5,
    orbitalPeriod: 10759,
    speed: 0.034,
    description: 'Известен своими великолепными кольцами из льда и камней.'
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    color: '#7de8e8',
    size: 18,
    orbitRadius: 370,
    realDiameter: 51118,
    realDistance: 2872.5,
    orbitalPeriod: 30687,
    speed: 0.012,
    description: 'Ледяной гигант, вращающийся на боку. Имеет бледно-голубой цвет.'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    color: '#4b70dd',
    size: 17,
    orbitRadius: 420,
    realDiameter: 49528,
    realDistance: 4495.1,
    orbitalPeriod: 60190,
    speed: 0.006,
    description: 'Самая далёкая планета. Ледяной гигант с сильнейшими ветрами.'
  }
];

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Масштабирование под размер экрана
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const minDim = Math.min(width, height);
        const neededSize = 900; // максимальный диаметр орбит
        setScale(Math.min(1, minDim / neededSize));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Анимация орбит
  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        setAngles(prev => prev.map((angle, i) => angle + planets[i].speed * speedMultiplier * delta));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speedMultiplier]);

  const getPlanetPosition = useCallback((index: number) => {
    const angle = angles[index];
    const radius = planets[index].orbitRadius * scale;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }, [angles, scale]);

  return (
    <div className="w-full h-screen bg-gray-950 overflow-hidden flex flex-col relative">
      {/* Звёздный фон */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Заголовок */}
      <div className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          🌌 Интерактивная Солнечная Система
        </h1>
        <p className="text-gray-400 text-sm mt-1">Нажмите на планету для получения информации</p>
      </div>

      {/* Основная область с Солнечной системой */}
      <div className="flex-1 relative flex items-center justify-center" ref={containerRef}>
        <div
          className="relative"
          style={{
            width: 900 * scale,
            height: 900 * scale
          }}
        >
          {/* Орбиты */}
          {planets.map((planet, index) => (
            <div
              key={`orbit-${index}`}
              className="absolute rounded-full border border-gray-700/40"
              style={{
                width: planet.orbitRadius * 2 * scale,
                height: planet.orbitRadius * 2 * scale,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Солнце */}
          <div
            className="absolute rounded-full cursor-pointer"
            style={{
              width: 50 * scale,
              height: 50 * scale,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #fff700 0%, #ff8c00 50%, #ff4500 100%)',
              boxShadow: '0 0 40px #ff8c00, 0 0 80px #ff6600, 0 0 120px #ff4500',
              animation: 'pulse 3s ease-in-out infinite'
            }}
            onClick={() => {
              setSelectedPlanet({
                name: 'Sun',
                nameRu: 'Солнце',
                color: '#ff8c00',
                size: 50,
                orbitRadius: 0,
                realDiameter: 1392700,
                realDistance: 0,
                orbitalPeriod: 0,
                speed: 0,
                description: 'Звезда в центре нашей Солнечной системы. Жёлтый карлик, содержащий 99.86% всей массы системы.'
              });
            }}
          />

          {/* Планеты */}
          {planets.map((planet, index) => {
            const pos = getPlanetPosition(index);
            const isSelected = selectedPlanet?.name === planet.name;
            const isHovered = hoveredPlanet === planet.name;

            return (
              <div
                key={`planet-${index}`}
                className="absolute cursor-pointer transition-transform duration-200"
                style={{
                  width: planet.size * scale + (isHovered ? 6 : 0),
                  height: planet.size * scale + (isHovered ? 6 : 0),
                  left: `calc(50% + ${pos.x}px - ${(planet.size * scale + (isHovered ? 6 : 0)) / 2}px)`,
                  top: `calc(50% + ${pos.y}px - ${(planet.size * scale + (isHovered ? 6 : 0)) / 2}px)`,
                  zIndex: isHovered || isSelected ? 20 : 10
                }}
                onClick={() => setSelectedPlanet(planet)}
                onMouseEnter={() => setHoveredPlanet(planet.name)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div
                  className="w-full h-full rounded-full relative"
                  style={{
                    background: planet.name === 'Earth'
                      ? `radial-gradient(circle at 30% 30%, #6db3f2, #1a75d1 40%, #2d8b4e 60%, #1a5c3a)`
                      : planet.name === 'Jupiter'
                      ? `radial-gradient(circle at 35% 35%, #f0d0a0, #c88b3a 40%, #a06020 70%, #8b4513)`
                      : planet.name === 'Saturn'
                      ? `radial-gradient(circle at 35% 35%, #f5e6b8, #e8d590 40%, #c4a84a 70%, #a08030)`
                      : planet.name === 'Mars'
                      ? `radial-gradient(circle at 35% 35%, #f0a070, #e57c4a 50%, #c05030)`
                      : planet.name === 'Venus'
                      ? `radial-gradient(circle at 35% 35%, #f5e0b0, #e8cda0 50%, #c4a060)`
                      : planet.name === 'Mercury'
                      ? `radial-gradient(circle at 35% 35%, #d0d0d0, #b5b5b5 50%, #808080)`
                      : planet.name === 'Uranus'
                      ? `radial-gradient(circle at 35% 35%, #a0f0f0, #7de8e8 50%, #50b0b0)`
                      : `radial-gradient(circle at 35% 35%, #7090f0, #4b70dd 50%, #2040a0)`,
                    boxShadow: isSelected
                      ? `0 0 15px ${planet.color}, 0 0 30px ${planet.color}`
                      : isHovered
                      ? `0 0 10px ${planet.color}`
                      : `0 0 5px ${planet.color}40`
                  }}
                >
                  {/* Кольца Сатурна */}
                  {planet.name === 'Saturn' && (
                    <div
                      className="absolute rounded-full border-2 border-yellow-200/60"
                      style={{
                        width: '180%',
                        height: '40%',
                        left: '-40%',
                        top: '30%',
                        transform: 'rotateX(70deg)',
                        borderColor: 'rgba(232, 213, 144, 0.6)',
                        borderWidth: '2px'
                      }}
                    />
                  )}
                </div>

                {/* Подпись при наведении */}
                {isHovered && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900/90 text-white text-xs px-2 py-1 rounded border border-gray-600">
                    {planet.nameRu}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Информационная панель */}
      {selectedPlanet && (
        <div className="absolute top-16 right-4 z-30 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-5 w-80 shadow-2xl animate-slideIn">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-xl"
            onClick={() => setSelectedPlanet(null)}
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex-shrink-0"
              style={{
                background: selectedPlanet.name === 'Sun'
                  ? 'radial-gradient(circle, #fff700, #ff8c00)'
                  : `radial-gradient(circle at 35% 35%, ${selectedPlanet.color}dd, ${selectedPlanet.color})`,
                boxShadow: `0 0 15px ${selectedPlanet.color}80`
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
              <p className="text-gray-400 text-sm">{selectedPlanet.name}</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPlanet.description}</p>

          <div className="space-y-2">
            <InfoRow
              icon="📏"
              label="Диаметр"
              value={selectedPlanet.realDiameter.toLocaleString('ru-RU') + ' км'}
            />
            {selectedPlanet.name !== 'Sun' && (
              <>
                <InfoRow
                  icon="🌍"
                  label="Расстояние от Солнца"
                  value={selectedPlanet.realDistance.toLocaleString('ru-RU') + ' млн км'}
                />
                <InfoRow
                  icon="🔄"
                  label="Орбитальный период"
                  value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                />
              </>
            )}
            {selectedPlanet.name === 'Sun' && (
              <InfoRow
                icon="🌡️"
                label="Температура поверхности"
                value="~5 500 °C"
              />
            )}
          </div>
        </div>
      )}

      {/* Панель управления */}
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Пауза
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Воспроизвести
              </>
            )}
          </button>

          {/* Скорость */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Скорость:</span>
            <div className="flex gap-1">
              {[0.25, 0.5, 1, 2, 5, 10].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    speedMultiplier === speed
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Сброс */}
          <button
            onClick={() => {
              setAngles(planets.map(() => Math.random() * Math.PI * 2));
              setSpeedMultiplier(1);
              setIsPlaying(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Сброс
          </button>
        </div>
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-gray-400 text-xs">{label}</div>
        <div className="text-white text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} дней`;
  }
  const years = Math.floor(days / 365);
  const remainingDays = Math.round(days % 365);
  if (remainingDays === 0) {
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
  }
  return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} ${remainingDays} дней`;
}

export default App;
