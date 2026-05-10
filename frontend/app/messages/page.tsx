'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const S: Record<string, React.CSSProperties> = {
  wrap:       { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora','Inter',sans-serif" },
  sidebar:    { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky' as const, top:0, height:'100vh' },
  logoBox:    { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logoInner:  { display:'flex', alignItems:'center', gap:10 },
  logoIcon:   { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  nav:        { flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' },
  link:       { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  linkActive: { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:       { flex:1, overflowY:'auto', padding:'40px', display:'flex', flexDirection:'column', height:'100vh' },
  input:      { padding:'10px 14px', borderRadius:10, border:'1px solid #e2e8f0', backgroundColor:'#fff', color:'#0f172a', fontSize:14, fontFamily:"'Sora','Inter',sans-serif", outline:'none' },
};

const CHATS = [
  { id: '1', name: 'Prof. Alan Turing', avatar: 'AT', lastMessage: 'The assignment looks good!', time: '10:42 AM', unread: 2, online: true },
  { id: '2', name: 'Physics Study Group', avatar: 'PG', lastMessage: 'When is the next lab session?', time: '9:15 AM', unread: 0, online: false },
  { id: '3', name: 'Alice Smith', avatar: 'AS', lastMessage: 'Can you help me with the setup?', time: 'Yesterday', unread: 5, online: true },
  { id: '4', name: 'Course Support', avatar: 'CS', lastMessage: 'Ticket #42 has been resolved.', time: 'Monday', unread: 0, online: false },
];

const MESSAGES: Record<string, { id: number; sender: 'me' | 'them'; text: string; time: string }[]> = {
  '1': [
    { id: 1, sender: 'them', text: 'Hi! Have you had a chance to look at the Physics assignment?', time: '10:30 AM' },
    { id: 2, sender: 'me',   text: 'Yes, I just finished reading through the requirements.', time: '10:35 AM' },
    { id: 3, sender: 'them', text: 'Great! The assignment looks good. Just make sure to include the diagrams for Chapter 4.', time: '10:42 AM' },
  ],
  '2': [
    { id: 1, sender: 'them', text: 'Hey team, when is the next lab session?', time: '9:10 AM' },
    { id: 2, sender: 'me',   text: 'I think it\'s on Thursday at 2 PM.', time: '9:15 AM' },
  ],
  '3': [
    { id: 1, sender: 'them', text: 'Hi! Can you help me with the environment setup for the project?', time: 'Yesterday' },
  ],
  '4': [
    { id: 1, sender: 'them', text: 'Your support ticket #42 regarding course access has been resolved.', time: 'Monday' },
    { id: 2, sender: 'me',   text: 'Thank you, I can access the course now!', time: 'Monday' },
  ],
};

export default function MessagesPage() {
  const { user, logout } = useAuth();
  const [activeChat, setActiveChat]     = useState<string | null>('1');
  const [message, setMessage]           = useState('');
  const [allMessages, setAllMessages]   = useState(MESSAGES);
  const [showMobileList, setShowMobileList] = useState(true);
  const [search, setSearch]             = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const activeContact = CHATS.find(c => c.id === activeChat);
  const currentMessages = activeChat ? (allMessages[activeChat] || []) : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    const newMsg = { id: Date.now(), sender: 'me' as const, text: message.trim(), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setAllMessages(p => ({ ...p, [activeChat]: [...(p[activeChat] || []), newMsg] }));
    setMessage('');
  };

  const filteredChats = CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const navItems = user?.role === 'admin' ? [
    { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
    { href:'/admin/users',     label:'Users',         icon:'👥' },
    { href:'/admin/courses',   label:'Courses',       icon:'📚' },
    { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
    { href:'/admin/logs',      label:'Activity Logs', icon:'📋' },
    { href:'/profile',         label:'Profile',       icon:'👤' },
  ] : user?.role === 'teacher' ? [
    { href:'/dashboard/teacher', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚' },
    { href:'/messages',          label:'Messages',      icon:'💬', active:true },
    { href:'/notifications',     label:'Notifications', icon:'🔔' },
    { href:'/profile',           label:'Profile',       icon:'👤' },
  ] : [
    { href:'/dashboard/student', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚' },
    { href:'/messages',          label:'Messages',      icon:'💬', active:true },
    { href:'/notifications',     label:'Notifications', icon:'🔔' },
    { href:'/profile',           label:'Profile',       icon:'👤' },
  ];

  const avatarBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';
  const avatarColor = user?.role === 'teacher' ? '#7c3aed' : user?.role === 'admin' ? '#4338ca' : '#065f46';
  const roleBadgeBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';

  return (
    <div style={S.wrap}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.logoBox}>
          <div style={S.logoInner}>
            <div style={S.logoIcon}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span style={{ fontWeight:700, fontSize:16, color:'#0f172a' }}>UniLearn</span>
          </div>
        </div>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor: avatarBg, display:'flex', alignItems:'center', justifyContent:'center', color: avatarColor, fontWeight:700, fontSize:14, flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor: roleBadgeBg, color: avatarColor, padding:'1px 8px', borderRadius:9999 }}>{user?.role}</span>
          </div>
        </div>
        <nav style={S.nav}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={item.active ? S.linkActive : S.link}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding:'10px', borderTop:'1px solid #f1f5f9' }}>
          <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#ef4444', background:'transparent', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" }}>
            <span>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main style={{ ...S.main, padding:24 }}>
        <div style={{ display:'flex', height:'100%', backgroundColor:'#fff', borderRadius:24, border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 4px 6px -1px rgb(0 0 0/0.05), 0 2px 4px -2px rgb(0 0 0/0.05)' }}>
          {/* Left Panel */}
          <div style={{ width:320, borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', backgroundColor:'#f8fafc', flexShrink:0 }}>
            {/* Header */}
            <div style={{ padding:20, borderBottom:'1px solid #e2e8f0' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <h1 style={{ fontSize:20, fontWeight:700, color:'#0f172a', margin:0 }}>Messages</h1>
                <button style={{ padding:'6px 10px', backgroundColor:'#4f46e5', color:'#fff', borderRadius:10, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600 }}>
                  <span>+</span> New
                </button>
              </div>
              <input
                type="text"
                placeholder="🔍 Search conversations..."
                style={{ ...S.input, width:'100%', padding:'10px 14px', borderRadius:10 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            {/* List */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {filteredChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  style={{ width:'100%', textAlign:'left', padding:'16px 20px', backgroundColor: activeChat === chat.id ? '#fff' : 'transparent', border:'none', borderBottom:'1px solid #f1f5f9', cursor:'pointer', display:'flex', gap:12, alignItems:'center', transition:'all 0.2s', borderLeft: activeChat === chat.id ? '3px solid #4f46e5' : '3px solid transparent' }}
                >
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:44, height:44, borderRadius:14, backgroundColor:'#e0e7ff', color:'#4338ca', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <span style={{ position:'absolute', bottom:-2, right:-2, width:12, height:12, backgroundColor:'#10b981', border:'2px solid #fff', borderRadius:'50%' }} />
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                      <span style={{ fontSize:14, fontWeight:600, color: activeChat === chat.id ? '#4338ca' : '#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{chat.name}</span>
                      <span style={{ fontSize:11, color:'#94a3b8', flexShrink:0 }}>{chat.time}</span>
                    </div>
                    <p style={{ fontSize:13, color:'#64748b', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span style={{ padding:'2px 6px', borderRadius:10, backgroundColor:'#ef4444', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0 }}>
                      {chat.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
            {activeChat && activeContact ? (
              <>
                {/* Chat Header */}
                <div style={{ padding:'16px 24px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ position:'relative' }}>
                      <div style={{ width:40, height:40, borderRadius:12, backgroundColor:'#e0e7ff', color:'#4338ca', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>
                        {activeContact.avatar}
                      </div>
                      {activeContact.online && (
                        <span style={{ position:'absolute', bottom:-2, right:-2, width:10, height:10, backgroundColor:'#10b981', border:'2px solid #fff', borderRadius:'50%' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize:15, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{activeContact.name}</p>
                      <p style={{ fontSize:12, fontWeight:500, margin:0, color: activeContact.online ? '#10b981' : '#94a3b8' }}>
                        {activeContact.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button style={{ width:36, height:36, borderRadius:10, border:'none', backgroundColor:'#f8fafc', color:'#64748b', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>📞</button>
                    <button style={{ width:36, height:36, borderRadius:10, border:'none', backgroundColor:'#f8fafc', color:'#64748b', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>📹</button>
                    <button style={{ width:36, height:36, borderRadius:10, border:'none', backgroundColor:'#f8fafc', color:'#64748b', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>⋮</button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex:1, overflowY:'auto', padding:24, backgroundColor:'#f8fafc', display:'flex', flexDirection:'column', gap:16 }}>
                  {currentMessages.map(msg => (
                    <div key={msg.id} style={{ display:'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth:'70%', display:'flex', flexDirection:'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start', gap:4 }}>
                        <div style={{ padding:'12px 16px', fontSize:14, lineHeight:1.5,
                          backgroundColor: msg.sender === 'me' ? '#4f46e5' : '#fff', 
                          color: msg.sender === 'me' ? '#fff' : '#0f172a',
                          border: msg.sender === 'me' ? 'none' : '1px solid #e2e8f0',
                          borderRadius: msg.sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          boxShadow: '0 1px 2px rgb(0 0 0/0.05)'
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize:11, color:'#94a3b8', padding:'0 4px' }}>{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSend} style={{ padding:'16px 24px', borderTop:'1px solid #e2e8f0', display:'flex', gap:12, backgroundColor:'#fff' }}>
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    style={{ ...S.input, flex:1, borderRadius:12, backgroundColor:'#f1f5f9', border:'none' }}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button type="submit" disabled={!message.trim()} style={{ width:44, height:44, borderRadius:12, backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, opacity: !message.trim() ? 0.5 : 1 }}>
                    🚀
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:'#f8fafc' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>💬</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>Select a conversation</h3>
                <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Choose a contact from the list to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
