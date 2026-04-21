import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import {
  PiCar,
  PiSteeringWheel,
  PiMoneyWavy,
  PiCalendarBlank,
} from 'react-icons/pi';

// Import images from config
import {
  suv,
  sedan,
  pickup,
  sport,
  coupe,
  convertible,
  electric,
  hybrid,
  gas,
  benz,
  bmw,
  audi,
  toyota,
  honda,
} from '../config/images';

// Mock data for cars
const carBodyTypes = {
  suv: { label: 'SUV', icon: suv, subtypes: [] },
  sedan: { label: 'Sedan', icon: sedan, subtypes: [] },
  truck: { label: 'Pickup', icon: pickup, subtypes: [] },
  sports_car: { label: 'Sport', icon: sport, subtypes: [] },
  coupe: { label: 'Coupe', icon: coupe, subtypes: [] },
  convertible: { label: 'Convertible', icon: convertible, subtypes: [] },
};

const carMakes = [
  { label: 'Toyota', icon: toyota },
  { label: 'Honda', icon: honda },
  { label: 'BMW', icon: bmw },
  { label: 'Mercedes', icon: benz },
  { label: 'Audi', icon: audi },
];

const statusOptions = [
  { key: 'new', label: 'New' },
  { key: 'used', label: 'Used' },
  { key: 'certified', label: 'Certified' },
];

const fuelOptions = [
  { key: 'gasoline', label: 'Gas', icon: gas },
  { key: 'hybrid', label: 'Hybrid', icon: hybrid },
  { key: 'electric', label: 'Electric', icon: electric },
  { key: 'diesel', label: 'Diesel', icon: gas },
];

const PRICE_MIN = 0;
const PRICE_MAX = 100_000_000;
const PRICE_STEP = 500_000;
const DROPDOWN_MARGIN = 16;

const formatCurrency = (value) => `₦${value.toLocaleString('en-NG')}`;

const HeroSearchBar = ({ className = '' }) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const buttonRefs = useRef({});
  const closeTimeoutRef = useRef(null);
  const priceSliderTrackRef = useRef(null);
  const activePriceHandleRef = useRef(null);
  const [keyword, setKeyword] = useState('');

  const [activeBodyType, setActiveBodyType] = useState([]);
  const [activeMakes, setActiveMakes] = useState([]);
  const [activeStatusOptions, setActiveStatusOptions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [yearRange, setYearRange] = useState({ min: null, max: null });
  const [activeFuelTypes, setActiveFuelTypes] = useState([]);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileFiltersOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [isMobileFiltersOpen]);

  const handleApplyFilters = useCallback(async () => {
    setIsApplyingFilters(true);

    const filters = {};
    if (keyword) filters.query = keyword;
    if (activeBodyType.length > 0)
      filters.bodyType = activeBodyType.join(',');
    if (activeMakes.length > 0) filters.make = activeMakes.join(',');
    if (activeStatusOptions.length > 0)
      filters.condition = activeStatusOptions.join(',');
    if (activeFuelTypes.length > 0)
      filters.fuelType = activeFuelTypes.join(',');
    if (priceRange.min) filters.minPrice = priceRange.min;
    if (priceRange.max) filters.maxPrice = priceRange.max;

    if (yearRange.min || yearRange.max) {
      const min = yearRange.min || 1990;
      const max = yearRange.max || new Date().getFullYear();
      const years = [];
      for (let y = min; y <= max; y++) years.push(y);
      filters.year = years.join(',');
    }

    setTimeout(() => {
      setIsApplyingFilters(false);
      setIsMobileFiltersOpen(false);
      navigate('/listings', { state: filters });
    }, 1000);
  }, [
    navigate,
    keyword,
    activeBodyType,
    activeMakes,
    activeStatusOptions,
    activeFuelTypes,
    priceRange,
    yearRange,
  ]);

  const bodyTypeLabel =
    activeBodyType.length > 0
      ? activeBodyType.map((k) => carBodyTypes[k]?.label).join(', ')
      : 'Body Type';

  const makeLabel =
    activeMakes.length > 0 ? activeMakes.join(', ') : 'Any Make';

  const fuelMenuLabel =
    activeFuelTypes.length > 0
      ? fuelOptions
          .filter((o) => activeFuelTypes.includes(o.key))
          .map((o) => o.label)
          .join(', ')
      : 'Fuel Type';

  const yearMenuLabel = (() => {
    const { min, max } = yearRange;
    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;
    if (max) return `To ${max}`;
    return 'Year';
  })();

  const statusMenuLabel =
    activeStatusOptions.length > 0
      ? statusOptions
          .filter((o) => activeStatusOptions.includes(o.key))
          .map((o) => o.label)
          .join(', ')
      : 'Condition';

  const priceMenuLabel = (() => {
    const { min, max } = priceRange;
    if (min === null && max === null) return 'Price Range';
    if (min !== null && max !== null)
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    if (min !== null) return `Min ${formatCurrency(min)}`;
    return `Max ${formatCurrency(max)}`;
  })();

  const sliderMinValue = priceRange.min ?? PRICE_MIN;
  const sliderMaxValue = priceRange.max ?? PRICE_MAX;
  const sliderSpread = PRICE_MAX - PRICE_MIN;
  const minPercent = ((sliderMinValue - PRICE_MIN) / sliderSpread) * 100;
  const maxPercent = ((sliderMaxValue - PRICE_MIN) / sliderSpread) * 100;
  const handleMakeToggle = (make) => {
    setActiveMakes((prev) =>
      prev.includes(make) ? prev.filter((m) => m !== make) : [...prev, make]
    );
  };

  const handleBodyTypeToggle = (key) => {
    setActiveBodyType((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleStatusToggle = (key) => {
    setActiveStatusOptions((prev) => {
      if (prev.includes(key)) {
        return prev.filter((option) => option !== key);
      }
      return [...prev, key];
    });
  };

  const handleFuelTypeToggle = (key) => {
    setActiveFuelTypes((prev) => {
      if (prev.includes(key)) {
        return prev.filter((option) => option !== key);
      }
      return [...prev, key];
    });
  };

  const handleSliderChange = useCallback((handle, value) => {
    setPriceRange((prev) => {
      const currentMin = prev.min ?? PRICE_MIN;
      const currentMax = prev.max ?? PRICE_MAX;

      if (handle === 'min') {
        if (value > currentMax) return prev;
        return { ...prev, min: value };
      }
      if (handle === 'max') {
        if (value < currentMin) return prev;
        return { ...prev, max: value };
      }
      return prev;
    });
  }, []);

  const resetKeyword = () => setKeyword('');
  const resetBodyType = () => setActiveBodyType([]);
  const resetMakes = () => setActiveMakes([]);
  const resetStatusFilters = () => setActiveStatusOptions([]);
  const resetPriceRange = () => setPriceRange({ min: null, max: null });
  const resetYearRange = () => setYearRange({ min: null, max: null });
  const resetFuelTypes = () => setActiveFuelTypes([]);

  const resetAllFilters = () => {
    resetKeyword();
    resetBodyType();
    resetMakes();
    resetStatusFilters();
    resetPriceRange();
    resetYearRange();
    resetFuelTypes();
    setHoveredDropdown(null);
    setDropdownPos(null);
  };

  const getPriceFromPointer = useCallback((clientX) => {
    if (!priceSliderTrackRef.current) return null;
    const rect = priceSliderTrackRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1
    );
    const rawValue = PRICE_MIN + percent * (PRICE_MAX - PRICE_MIN);
    return Math.round(rawValue / PRICE_STEP) * PRICE_STEP;
  }, []);

  const handlePricePointerMove = useCallback(
    (event) => {
      if (!activePriceHandleRef.current) return;
      const nextValue = getPriceFromPointer(event.clientX);
      if (nextValue !== null)
        handleSliderChange(activePriceHandleRef.current, nextValue);
    },
    [getPriceFromPointer, handleSliderChange]
  );

  const stopPriceDrag = useCallback(() => {
    activePriceHandleRef.current = null;
    document.removeEventListener('pointermove', handlePricePointerMove);
    document.removeEventListener('pointerup', stopPriceDrag);
  }, [handlePricePointerMove]);

  const startPriceDrag = useCallback(
    (handle) => (event) => {
      event.preventDefault();
      activePriceHandleRef.current = handle;
      document.addEventListener('pointermove', handlePricePointerMove);
      document.addEventListener('pointerup', stopPriceDrag);
    },
    [handlePricePointerMove, stopPriceDrag]
  );

  useEffect(() => {
    return () => stopPriceDrag();
  }, [stopPriceDrag]);

  const openDropdown = (key) => {
    clearCloseTimeout();
    const el = buttonRefs.current[key];
    if (!el || !containerRef.current) {
      setHoveredDropdown(null);
      setDropdownPos(null);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const left = rect.left - containerRect.left + rect.width / 2;
    const top = rect.bottom - containerRect.top + 8;
    setDropdownPos({ left, top, desiredLeft: left });
    setHoveredDropdown(key);
  };

  const closeDropdown = () => {
    setHoveredDropdown(null);
    setDropdownPos(null);
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDesktopMouseEnter = (key) => {
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      openDropdown(key);
    }
  };

  const handleDesktopMouseLeave = () => {
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      closeTimeoutRef.current = setTimeout(() => {
        closeDropdown();
      }, 150);
    }
  };

  const handleDropdownMouseEnter = () => {
    clearCloseTimeout();
  };

  const handleMenuButtonClick = (key) => {
    if (hoveredDropdown === key) {
      closeDropdown();
    } else {
      openDropdown(key);
    }
  };

  useLayoutEffect(() => {
    if (!hoveredDropdown || !dropdownPos || !dropdownRef.current || !containerRef.current) return;
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const halfWidth = dropdownRect.width / 2;
    const desiredLeft = dropdownPos.desiredLeft ?? dropdownPos.left;
    
    const minLeftViewport = DROPDOWN_MARGIN + halfWidth;
    const maxLeftViewport = viewportWidth - DROPDOWN_MARGIN - halfWidth;
    
    const minLeft = minLeftViewport - containerRect.left;
    const maxLeft = maxLeftViewport - containerRect.left;
    
    let clampedLeft;
    if (minLeft > maxLeft) {
      clampedLeft = (viewportWidth / 2) - containerRect.left;
    } else {
      clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);
    }
    if (clampedLeft !== dropdownPos.left) {
      setDropdownPos((prev) => (prev ? { ...prev, left: clampedLeft } : prev));
    }
  }, [hoveredDropdown, dropdownPos]);

  useEffect(() => {
    if (!hoveredDropdown) return undefined;
    const handleResize = () => {
      const el = buttonRefs.current[hoveredDropdown];
      if (el && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        const left = rect.left - containerRect.left + rect.width / 2;
        const top = rect.bottom - containerRect.top + 8;
        setDropdownPos({ left, top, desiredLeft: left });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredDropdown]);

  const menuItems = [
    {
      label: keyword || 'Search',
      key: 'Keyword',
      icon: Search,
      items: (variant = 'desktop') => (
        <div
          className={`${
            variant === 'mobile' ? 'w-full' : 'w-72 sm:w-80'
          } p-4 space-y-3`}
        >
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-[var(--color-text)]">
              Keyword Search
            </p>
            <button
              type="button"
              onClick={resetKeyword}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="relative">
            <Search className="size-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. 'Red Toyota Camry'"
              className="w-full border border-[var(--color-border-subtle)] rounded-full py-2 pl-9 pr-14 text-sm text-[var(--color-text)] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {keyword && (
              <button
                type="button"
                onClick={resetKeyword}
                className="absolute inset-y-0 right-3 text-xs font-medium text-[var(--color-muted)] hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      label: makeLabel,
      key: 'Make',
      icon: PiSteeringWheel,
      items: (variant = 'desktop') => (
        <div
          className={`${
            variant === 'mobile' ? 'w-full' : 'w-[min(90vw,420px)]'
          } p-5 space-y-6`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-[var(--color-text)]">Make</p>
            </div>
            <button
              type="button"
              onClick={resetMakes}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {carMakes.map((make) => {
              const isActive = activeMakes.includes(make.label);
              return (
                <button
                  key={make.label}
                  type="button"
                  onClick={() => handleMakeToggle(make.label)}
                  className={`flex items-center gap-2 p-2 border rounded-lg ${
                    isActive ? 'border-primary bg-primary/5' : 'border-[var(--color-border-subtle)]'
                  }`}
                >
                  <img
                    src={make.icon}
                    alt={make.label}
                    className="w-6 h-6 object-contain"
                  />
                  <span>{make.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      label: bodyTypeLabel,
      key: 'Body Type',
      icon: PiCar,
      items: (variant = 'desktop') => (
        <div
          className={`${
            variant === 'mobile'
              ? 'w-full'
              : 'w-[min(90vw,490px)] sm:w-[min(100vw,600px)]'
          } p-5 space-y-5`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[var(--color-text)]">Body Type</p>
            </div>
            <button
              type="button"
              onClick={resetBodyType}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(carBodyTypes).map(([key, config]) => {
              const isActive = activeBodyType.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleBodyTypeToggle(key)}
                  className={`flex flex-col items-center justify-center border rounded-lg py-6 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-primary text-primary shadow-sm bg-primary/5'
                      : 'border-[var(--color-border-subtle)] text-[var(--color-muted)] hover:border-primary/40'
                  }`}
                >
                  <img
                    src={config.icon}
                    alt={config.label}
                    className="w-8 h-8 mb-2 object-contain"
                  />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },

    {
      label: priceMenuLabel,
      key: 'Price Range',
      icon: PiMoneyWavy,
      items: (variant = 'desktop') => (
        <div
          className={`${
            variant === 'mobile' ? 'w-full' : 'w-[min(90vw,420px)]'
          } p-5 space-y-5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-[var(--color-text)]">
                Price Range
              </p>
            </div>
            <button
              type="button"
              onClick={resetPriceRange}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {['min', 'max'].map((field) => (
              <div key={field} className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                  ₦
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={field === 'min' ? 'Min Price' : 'Max Price'}
                  value={
                    priceRange[field] !== null
                      ? priceRange[field].toLocaleString('en-NG')
                      : ''
                  }
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPriceRange((prev) => ({
                      ...prev,
                      [field]: val ? Number(val) : null,
                    }));
                  }}
                  className="w-full border border-[var(--color-border-subtle)] rounded-full py-3 pl-8 pr-4 text-sm text-[var(--color-text)] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="relative h-8" ref={priceSliderTrackRef}>
              <div className="absolute top-1/2 left-0 w-full h-2 bg-[var(--color-elevated)] rounded-full -translate-y-1/2" />
              <div
                className="absolute top-1/2 h-2 bg-primary rounded-full -translate-y-1/2"
                style={{
                  left: `${minPercent}%`,
                  right: `${100 - maxPercent}%`,
                }}
              />
              <div
                className="absolute top-1/2 w-4 h-4 bg-[var(--color-surface)] border-2 border-primary rounded-full -translate-y-1/2"
                style={{ left: `calc(${minPercent}% - 8px)` }}
                onPointerDown={startPriceDrag('min')}
                tabIndex={0}
              />
              <div
                className="absolute top-1/2 w-4 h-4 bg-[var(--color-surface)] border-2 border-primary rounded-full -translate-y-1/2"
                style={{ left: `calc(${maxPercent}% - 8px)` }}
                onPointerDown={startPriceDrag('max')}
                tabIndex={0}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--color-muted)] mt-2">
              <span>{formatCurrency(PRICE_MIN)}</span>
              <span>{formatCurrency(PRICE_MAX)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'More Filters',
      key: 'More Filters',
      icon: Filter,
      items: (variant = 'desktop') => (
        <div
          className={`${
            variant === 'mobile' ? 'w-full' : 'w-[min(90vw,480px)]'
          } p-5 space-y-6`}
        >
          {/* Year Range Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-[var(--color-text)]">
                Year Range
              </p>
              <button
                type="button"
                onClick={resetYearRange}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-3">
              {['min', 'max'].map((field) => (
                <div key={field} className="flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={field === 'min' ? 'Min Year' : 'Max Year'}
                    value={yearRange[field] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setYearRange((prev) => ({
                        ...prev,
                        [field]: val ? Number(val) : null,
                      }));
                    }}
                    className="w-full border border-[var(--color-border-subtle)] rounded-full py-3 px-4 text-sm text-[var(--color-text)] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-[var(--color-elevated)]" />

          {/* Condition Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-semibold text-[var(--color-text)]">Condition</p>
              <button
                type="button"
                onClick={resetStatusFilters}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-3">
              {statusOptions.map((option) => {
                const isActive = activeStatusOptions.includes(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleStatusToggle(option.key)}
                    className={`flex w-full text-sm font-normal items-center justify-center gap-3 rounded-full border px-3 py-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-sky/30 text-primary border-primary/40'
                        : 'border-[var(--color-border-subtle)] text-[var(--color-muted)] hover:text-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[var(--color-elevated)]" />

          {/* Fuel Type Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-[var(--color-text)]">Fuel Type</p>
              <button
                type="button"
                onClick={resetFuelTypes}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {fuelOptions.map((option) => {
                const isActive = activeFuelTypes.includes(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleFuelTypeToggle(option.key)}
                    className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-[var(--color-border-subtle)] text-[var(--color-muted)] hover:border-primary/40'
                    }`}
                  >
                    <img
                      src={option.icon}
                      alt={option.label}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        ref={containerRef}
        className={`${className} w-full max-w bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-full lg:rounded-2xl flex items-center px-1 py-1 lg:px-4 lg:py-2 relative`}
      >
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-1 px-3 py-2 text-xs font-semibold text-primary bg-sky rounded-full h-12"
        >
          <Filter className="size-4" />
          Filters
        </button>
        <div className="w-full self-stretch flex-1 flex items-center justify-between gap-2 relative z-50">
          <div className="lg:hidden w-full h-full px-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by keyword..."
              className="w-full h-full bg-transparent focus:outline-none border-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:ring-0 p-0"
            />
          </div>
          <nav
            className={`w-full hidden md:flex items-center justify-between gap-2 relative ${
              hoveredDropdown ? '' : 'lg:divide-x divide-gray-200'
            }`}
          >
            {menuItems.map((menu) => (
              <div
                key={menu.key}
                className="relative w-full justify-center items-center hidden lg:flex"
                onMouseEnter={() => handleDesktopMouseEnter(menu.key)}
                onMouseLeave={handleDesktopMouseLeave}
              >
                <button
                  ref={(el) => (buttonRefs.current[menu.key] = el)}
                  className={`flex flex-col items-center justify-center lg:justify-start w-full px-2 py-6 transition-all duration-200 ${
                    hoveredDropdown === menu.key
                      ? 'bg-sky rounded-full'
                      : 'text-text'
                  }`}
                  onClick={() => handleMenuButtonClick(menu.key)}
                  type="button"
                >
                  <span className="text-xs text-start w-full mb-2 text-[var(--color-muted)]">{menu.key}</span>
                  <div className='w-full flex items-center'>
                    <menu.icon className="size-5 text-[var(--color-muted)] shrink-0 sm:mr-2" />
                    <div className="hidden lg:flex">
                      <span className="line-clamp-1 text-sm">{menu.label}</span>
                    </div>
                    <ChevronDown
                      className={`${
                        hoveredDropdown === menu.key ? 'rotate-180' : ''
                      } size-3 text-[var(--color-muted)] ml-auto hidden md:inline-flex transition-transform`}
                    />
                  </div>
                </button>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="btn btn-circle btn-primary h-12 w-12"
          >
            <Search className="size-5 text-white" />
          </button>
        </div>

      {hoveredDropdown &&
        dropdownPos &&
        menuItems.find((m) => m.key === hoveredDropdown)?.items && (
          <div
            ref={dropdownRef}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDesktopMouseLeave}
            style={{
              position: 'absolute',
              top: dropdownPos.top,
              left: dropdownPos.left,
              transform: 'translateX(-50%)',
              zIndex: 60,
            }}
            className="bg-[var(--color-surface)] rounded-xl min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl border border-gray-100"
          >
            {menuItems.find((m) => m.key === hoveredDropdown)?.items()}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-[var(--color-surface)] rounded-t-3xl pb-5 overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
            >
              <div className="py-6 flex items-start justify-between gap-4 px-4 sticky top-0 bg-[var(--color-surface)] pb-4 z-10 border-b border-gray-100">
                <p className="text-lg font-medium text-[var(--color-text)]">Filters</p>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 rounded-full bg-[var(--color-elevated)] text-[var(--color-muted)]"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="">
                {menuItems.map((menu) => (
                  <div
                    key={`${menu.key}-mobile`}
                    className=" border-b py-4 border-[var(--color-border-subtle)]"
                  >
                    {menu.items('mobile')}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 px-4">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full py-3 border border-primary/40 text-primary font-semibold rounded-full"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-full"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSearchBar;
