import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const GAZETTE_QUOTES = [
    { quote: "The ability to track every technical milestone in a centralized repository has revolutionized how we prepare for accreditation and showcase our students' true potential.", author: "Dean's Office", role: "School of Engineering & IT", initial: "D" },
    { quote: "This portal has streamlined our documentation process significantly. It ensures that every student's achievement is recognized and verified with high precision.", author: "Rakhi Jha", role: "Assistant Professor, CSE", initial: "R" },
    { quote: "For students, this is more than a portal—it's a digital resume that grows with every project they complete. It bridges the gap between academics and industry.", author: "Placement Cell", role: "Industry Relations", initial: "P" },
    { quote: "We've observed a marked increase in students' participation in research and certifications since the launch of this achievement portal.", author: "Mamatha V", role: "Assistant Professor, IT", initial: "M" },
    { quote: "Mapping student achievements to academic credits has become seamless. It encourages a healthy competitive spirit among our budding engineers.", author: "HOD Computer Science", role: "Department Management", initial: "H" },
    { quote: "The transparency offered by this system allows us to mentor students more effectively based on their real-time growth and technical interests.", author: "Saayantani De", role: "Assistant Professor, CSE", initial: "S" },
    { quote: "The automated verification workflow ensures that no fake certifications enter the system, maintaining the high integrity of our institutional records.", author: "Registrar Office", role: "Academic Records", initial: "R" },
    { quote: "Digital preservation of student achievements is crucial for future-proofing their careers. This portal manages it exceptionally well.", author: "Syed Rashid Anwar", role: "Assistant Professor, ECE", initial: "S" },
    { quote: "Integrating global achievements from platforms like GitHub and LeetCode into one portal is exactly what a modern engineering school needs.", author: "Innovation Lab", role: "Research & Development", initial: "I" },
    { quote: "Mentoring students on their technical journey is much more data-driven now. We can see exactly where each student is excelling.", author: "Dr Nidhi Dua", role: "Associate Professor, CSE", initial: "N" },
    { quote: "The public portfolio feature has been a game changer. Recruiters can directly verify our students' accomplishments without any manual paperwork.", author: "Training & Placement", role: "Corporate Connect", initial: "T" },
    { quote: "As a student, seeing my dashboard grow with verified badges motivates me to participate in more hackathons and technical certifications.", author: "Ritesh Kumar", role: "Final Year Student , CCS Club President", initial: "R" },
    { quote: "We now have real-time analytics on which skills are trending in our student body, allowing us to align our curriculum with industry demands.", author: "Academic Council", role: "Curriculum Design", initial: "A" },
    { quote: "I submitted my national-level coding competition win and it was verified within 24 hours. The process is fast, transparent, and incredibly reliable.", author: "Gourav Kumar Pandey", role: "Final Year Student , Techinal Lead , GDG", initial: "G" },
    { quote: "Having a centralized platform to monitor all departmental achievements has drastically improved our NIRF submission quality and turnaround time.", author: "NIRF Coordination Cell", role: "Institutional Rankings", initial: "N" },
    { quote: "The merit point system has brought a new level of engagement. Students are proactively seeking certifications to climb the leaderboard.", author: "Faculty Coordinator", role: "Student Affairs", initial: "F" },
    { quote: "This portal reflects SoEIT's commitment to digital excellence. Every verified achievement here tells a story of perseverance.", author: "Principal", role: "School of Engineering & IT", initial: "P" },
    { quote: "The portal's ability to categorize achievements by skill sets helps us identify the diverse talents within our student groups.", author: "Laboratory In-charge", role: "Department of IT", initial: "L" },
    { quote: "Verified dossiers from this portal have become a standard part of our student evaluation and recommendation process.", author: "Evaluation Committee", role: "Academic Audit", initial: "E" },
    { quote: "It's heartening to see our students so enthusiastic about building their digital portfolios through this achievement tracking system.", author: "Alumni Relations", role: "Institutional Growth", initial: "A" },
];

const WelcomeScreen = ({ navigation }) => {
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIdx((current) => (current + 1) % GAZETTE_QUOTES.length);
    }, 2000); 
    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    { title: 'Hackathons', icon: 'trophy', color: '#ff6b6b' },
    { title: 'Coding', icon: 'terminal', color: '#4facfe' },
    { title: 'Internships', icon: 'briefcase', color: '#00f2fe' },
    { title: 'Mentorship', icon: 'people', color: '#f093fb' },
  ];

  const stats = [
    { value: '2800+', label: 'PLACEMENTS', icon: 'briefcase' },
    { value: '₹23 LPA', label: 'HIGHEST PKG', icon: 'star' },
    { value: 'NAAC A', label: 'ACCREDITED', icon: 'school' },
  ];

  const currentQuote = GAZETTE_QUOTES[activeQuoteIdx];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
      {/* Premium Light Hero Section */}
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={['#f8fafc', '#f1f5f9', '#ffffff']}
          style={styles.heroGradient}
        >
          <SafeAreaView style={styles.heroContent}>
            {/* Top Left Logo Header */}
            <View style={styles.logoHeader}>
               <View style={styles.logoBadge}>
                  <Ionicons name="school" size={24} color={COLORS.primary} />
               </View>
               <View>
                  <Text style={styles.logoText}>SoEIT</Text>
                  <Text style={styles.logoSub}>PORTAL</Text>
               </View>
            </View>

            <View style={styles.heroSpacer} />

            <View style={styles.officialBadge}>
              <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
              <Text style={styles.badgeText}>OFFICIAL SoEIT PORTAL</Text>
            </View>

            <Text style={styles.heroTitle}>
              Empowering{'\n'}
              <Text style={styles.emphasizedText}>Engineering Excellence</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Arka Jain University's premier hub for tracking academic milestones, technical certifications, and global wins.
            </Text>

            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#4f46e5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.secondaryBtnText}>Registration</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Quick Access Grid - Light Theme */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>OPPORTUNITIES</Text>
            <View style={styles.labelUnderline} />
        </View>
        <View style={styles.quickGrid}>
          {quickLinks.map((link, idx) => (
            <View key={idx} style={styles.quickCard}>
              <View style={[styles.quickIconBox, { backgroundColor: link.color + '10' }]}>
                <Ionicons name={link.icon} size={26} color={link.color} />
              </View>
              <Text style={styles.quickText}>{link.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Institutional Stats Strip - Premium Light Card */}
      <View style={styles.statsStrip}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* THE SoEIT GAZETTE Section - Newspaper Style Light */}
      <View style={styles.gazetteSection}>
        <View style={styles.gazetteHeader}>
          <View style={styles.gazetteRule} />
          <Text style={styles.gazetteTitle}>THE SoEIT GAZETTE</Text>
          <View style={styles.gazetteRule} />
          <Text style={styles.gazetteSub}>VOICES • ACHIEVEMENTS • EXCELLENCE</Text>
        </View>

        <View style={styles.gazetteCard}>
          <View style={styles.gazetteBadge}>
            <Text style={styles.gazetteLabel}>EDITORIAL VOICE</Text>
          </View>
          <Text style={styles.gazetteQuote}>
            "{currentQuote.quote}"
          </Text>
          <View style={styles.gazetteByline}>
            <View style={styles.gazetteAvatar}>
               <Text style={styles.avatarText}>{currentQuote.initial}</Text>
            </View>
            <View>
              <Text style={styles.bylineName}>— {currentQuote.author}</Text>
              <Text style={styles.bylineRole}>{currentQuote.role}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.universityFooter}>
         <View style={styles.footerRule} />
         <Text style={styles.footerLarge}>ARKA JAIN UNIVERSITY</Text>
         <Text style={styles.footerSmall}>SCHOOL OF ENGINEERING & IT • ESTD 2017</Text>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  heroContainer: { height: 480 },
  heroGradient: { flex: 1 },
  heroContent: { padding: 25, flex: 1 },
  logoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)' },
  logoText: { color: '#0f172a', fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  logoSub: { color: COLORS.primary, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginTop: -4 },
  heroSpacer: { flex: 1 },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
  },
  badgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { color: '#0f172a', fontSize: 38, fontWeight: '900', lineHeight: 44 },
  emphasizedText: { color: COLORS.primary },
  heroSubtitle: { color: '#475569', fontSize: 16, marginTop: 15, lineHeight: 24, fontWeight: '500' },
  authButtons: { flexDirection: 'row', gap: 12, marginTop: 40 },
  primaryBtn: { flex: 1.5, borderRadius: 16, overflow: 'hidden', elevation: 12, boxShadow: '0 8px 12px rgba(139, 0, 0, 0.3)' },
  btnGradient: { paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  secondaryBtnText: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  section: { padding: 25 },
  sectionHeader: { marginBottom: 25 },
  sectionLabel: { color: '#64748b', fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
  labelUnderline: { height: 3, width: 30, backgroundColor: COLORS.primary, marginTop: 6, borderRadius: 2 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickCard: { alignItems: 'center', gap: 12, width: (width - 50) / 4 },
  quickIconBox: { width: 62, height: 62, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  quickText: { color: '#1e293b', fontSize: 11, fontWeight: '800' },
  statsStrip: { 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    marginHorizontal: 25, 
    borderRadius: 28, 
    padding: 24, 
    borderWidth: 1, 
    borderColor: '#f1f5f9',
    justifyContent: 'space-between',
    elevation: 8,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
  },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.primary, fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#64748b', fontSize: 11, fontWeight: '800', marginTop: 4 },
  gazetteSection: { padding: 25, marginTop: 30 },
  gazetteHeader: { alignItems: 'center', marginBottom: 25 },
  gazetteRule: { height: 1.5, width: '100%', backgroundColor: '#e2e8f0', marginVertical: 8 },
  gazetteTitle: { color: '#0f172a', fontSize: 26, fontWeight: '900', letterSpacing: 1.5 },
  gazetteSub: { color: '#64748b', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  gazetteCard: { backgroundColor: '#fffdf9', borderRadius: 8, padding: 25, borderWidth: 1, borderColor: '#ece7db', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', elevation: 4, minHeight: 180 },
  gazetteBadge: { paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ece7db', marginBottom: 20 },
  gazetteLabel: { color: '#991b1b', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  gazetteQuote: { color: '#1e293b', fontSize: 17, fontWeight: '700', fontStyle: 'italic', lineHeight: 26, marginBottom: 25 },
  gazetteByline: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  gazetteAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#991b1b10', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#991b1b', fontWeight: '900', fontSize: 20 },
  bylineName: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  bylineRole: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  universityFooter: { alignItems: 'center', padding: 40 },
  footerRule: { height: 2, width: 40, backgroundColor: COLORS.primary, marginBottom: 20, borderRadius: 1 },
  footerLarge: { color: '#0f172a', fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
  footerSmall: { color: '#64748b', fontSize: 11, fontWeight: '700', marginTop: 8, letterSpacing: 1 },
});

export default WelcomeScreen;
