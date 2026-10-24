import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Logo } from '../common/Logo';
import { logout as logoutAction } from '../../store/slices/authSlice';
import { authApi } from '../../services/authApi';
import { CURRENT_STUDENT } from '../../data/mockData';
import {
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Bookmark,
  BookMarked,
  Compass,
  Settings,
  HelpCircle,
  Bell, 
  Menu,
  X,
  LogOut,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import {
  setSearchQuery,
  setSelectedCourseId,
  setSelectedSemesterNum,
  setSortBy,
  resetFilters,
  selectExploreCourses,
  selectExploreFilters,
  selectFilteredExploreNotes,
  selectSavedNoteIds,
  selectEnrolledCourseIds,
  fetchExploreData,
} from '../../store/slices/exploreSlice';
import { ExploreFilterBar } from '../student/exploreNotes/ExploreFilterBar';

export const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user: authUser, role: currentRole } = useSelector((state) => state.auth);
  const user = authUser || CURRENT_STUDENT;

  const courses = useSelector(selectExploreCourses);
  const filters = useSelector(selectExploreFilters);
  const filteredNotes = useSelector(selectFilteredExploreNotes);
  const savedNoteIds = useSelector(selectSavedNoteIds) || [];
  const enrolledCourseIds = useSelector(selectEnrolledCourseIds) || [];

  // Ensure explore courses/notes catalog is loaded for the search & filter
  useEffect(() => {
    if (!courses || courses.length === 0) {
      dispatch(fetchExploreData());
    }
  }, [dispatch, courses]);

  // Navigate to /explore when user searches or filters from another page
  const handleSearchChange = (val) => {
    dispatch(setSearchQuery(val));
    if (location.pathname !== '/explore' && val.trim().length > 0) {
      navigate('/explore');
    }
  };

  const handleCourseChange = (val) => {
    dispatch(setSelectedCourseId(val));
    if (location.pathname !== '/explore') {
      navigate('/explore');
    }
  };

  const handleSemesterChange = (val) => {
    dispatch(setSelectedSemesterNum(val));
    if (location.pathname !== '/explore') {
      navigate('/explore');
    }
  };

  const handleSortChange = (val) => {
    dispatch(setSortBy(val));
    if (location.pathname !== '/explore') {
      navigate('/explore');
    }
  };


  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const mainNavItems = [
    { id: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/student/add-notes', label: 'Add Notes', icon: FolderOpen },
    { id: '/student/my-study', label: 'My Study', icon: GraduationCap },
    { id: '/student/saved-notes', label: 'Saved Notes', icon: Bookmark, badge: savedNoteIds.length },
    { id: '/student/enrolled-notes', label: 'Enrolled Notes', icon: BookMarked, badge: enrolledCourseIds.length },
  ];

  const exploreNavItems = [
    { id: '/explore', label: 'Explore Notes', icon: Compass },
  ];

 

  const isNavActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 sticky top-0 h-screen shrink-0 z-30 select-none">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Logo onClick={() => navigate('/student/dashboard')} />
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* MAIN SECTION */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Main
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-primary-light text-primary-dark font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-primary-dark' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        active ? 'bg-indigo-200/70 text-indigo-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* EXPLORE SECTION */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Explore
            </div>
            <nav className="space-y-1">
              {exploreNavItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

           
        </div>

        {/* BOTTOM SECTION & USER PROFILE */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium px-1">
            <button
              onClick={() => navigate('/student/settings')}
              className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
          </div>

          {/* Current Student Profile Box */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.academicCourseCode}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-xs flex">
          {/* Backdrop click to dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col shadow-2xl p-4 z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Logo onClick={() => { navigate('/student/dashboard'); setMobileSidebarOpen(false); }} />
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase px-2 mb-1">Main</p>
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigate(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        active ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase px-2 mb-1">Explore</p>
                {exploreNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigate(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        active ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Preferences / Quick links */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase px-2 mb-1">Preferences</p>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/student/settings');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isNavActive('/student/settings') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Help & Support</span>
                </button>
              </div>
            </div>

            {/* User Profile & Logout */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100 shrink-0" alt={user.name || 'User'} />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Student'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email || user?.academicCourseCode || 'student@domain.com'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

           {/* Header Search & Course Filter Bar */}
          <ExploreFilterBar
            searchQuery={filters.searchQuery}
            onSearchChange={handleSearchChange}
            courses={courses}
            selectedCourseId={filters.selectedCourseId}
            onCourseChange={handleCourseChange}
            selectedSemesterNum={filters.selectedSemesterNum}
            onSemesterChange={handleSemesterChange}
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            onResetFilters={() => dispatch(resetFilters())}
            totalNotes={filteredNotes.length}
          />

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            {/* <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                    <div className="p-3 text-xs hover:bg-slate-50 transition-colors">
                      <p className="font-semibold text-slate-800">New Semester Notes Added</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Prof. Sharma added 4 new notes in Programming in C.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                    </div>
                    <div className="p-3 text-xs hover:bg-slate-50 transition-colors">
                      <p className="font-semibold text-slate-800">Note Trending 🎉</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Your "Operators in C" note crossed 100 views!</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}
            </div> */}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                 
                <span className="hidden lg:inline text-xs font-semibold text-slate-700">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-xs border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-block text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      {user.academicCourseCode} • Sem {user.currentSemester}
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/student/my-study');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Academic Study
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/student/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Account Settings
                    </button>
                    
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
