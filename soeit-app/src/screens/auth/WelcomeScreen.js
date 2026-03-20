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
      {/* Premium Hero Section with Gradient Only */}
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={['#1e1b4b', '#312e81', COLORS.bgPrimary]}
          style={styles.heroGradient}
        >
          <SafeAreaView style={styles.heroContent}>
            {/* Top Left Logo Header */}
            <View style={styles.logoHeader}>
               <View style={styles.logoBadge}>
                  <Ionicons name="school" size={24} color="#fff" />
               </View>
               <View>
                  <Text style={styles.logoText}>SoEIT</Text>
                  <Text style={styles.logoSub}>PORTAL</Text>
               </View>
            </View>

            <View style={styles.heroSpacer} />

            <View style={styles.officialBadge}>
              <Ionicons name="shield-checkmark" size={14} color={COLORS.secondary} />
              <Text style={styles.badgeText}>OFFICIAL SoEIT PORTAL</Text>
            </View>

            <Text style={styles.heroTitle}>
              Empowering{'\n'}
              <Text style={styles.emphasizedText}>Engineering Excellence</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Arka Jain University's (NAAC A Accredited) premier hub for tracking academic milestones and technical certifications.
            </Text>

            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#4f46e5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.primaryBtnText}>Explore Portal</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.secondaryBtnText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Quick Access Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK ACCESS HUB</Text>
        <View style={styles.quickGrid}>
          {quickLinks.map((link, idx) => (
            <View key={idx} style={styles.quickCard}>
              <View style={[styles.quickIconBox, { backgroundColor: link.color + '15' }]}>
                <Ionicons name={link.icon} size={24} color={link.color} />
              </View>
              <Text style={styles.quickText}>{link.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Institutional Stats Strip */}
      <View style={styles.statsStrip}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* THE SoEIT GAZETTE Section - Newspaper Style */}
      <View style={styles.gazetteSection}>
        <View style={styles.gazetteHeader}>
          <View style={styles.gazetteRule} />
          <Text style={styles.gazetteTitle}>THE SoEIT GAZETTE</Text>
          <View style={styles.gazetteRule} />
          <Text style={styles.gazetteSub}>VOICES • ACHIEVEMENTS • EXCELLENCE</Text>
        </View>

        <View style={styles.gazetteCard}>
          <View style={styles.gazetteBadge}>
            <Text style={styles.gazetteLabel}>FEATURED VOICE</Text>
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
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  heroContainer: { height: 500 },
  heroGradient: { flex: 1 },
  heroContent: { padding: 25, flex: 1 },
  logoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  logoSub: { color: COLORS.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginTop: -4 },
  heroSpacer: { flex: 1 },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    gap: 6,
  },
  badgeText: { color: COLORS.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { color: '#fff', fontSize: 36, fontWeight: '900', lineHeight: 42 },
  emphasizedText: { color: COLORS.secondary },
  heroSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 15, lineHeight: 22, fontWeight: '500' },
  authButtons: { flexDirection: 'row', gap: 12, marginTop: 35 },
  primaryBtn: { flex: 1.5, borderRadius: 16, overflow: 'hidden', elevation: 8 },
  btnGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  section: { padding: 25 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickCard: { alignItems: 'center', gap: 10, width: (width - 50) / 4 },
  quickIconBox: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  quickText: { color: COLORS.textPrimary, fontSize: 11, fontWeight: '700' },
  statsStrip: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.bgCard, 
    marginHorizontal: 25, 
    borderRadius: 24, 
    padding: 24, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    elevation: 4,
  },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.primary, fontSize: 20, fontWeight: '900' },
  statLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800', marginTop: 4 },
  gazetteSection: { padding: 25, marginTop: 25 },
  gazetteHeader: { alignItems: 'center', marginBottom: 25 },
  gazetteRule: { height: 1.5, width: '100%', backgroundColor: COLORS.border, marginVertical: 8 },
  gazetteTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '900', letterSpacing: 1.5 },
  gazetteSub: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  gazetteCard: { backgroundColor: '#fffdf9', borderRadius: 4, padding: 25, borderWidth: 1, borderColor: '#ece7db', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3, minHeight: 180 },
  gazetteBadge: { paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ece7db', marginBottom: 20 },
  gazetteLabel: { color: '#8b0000', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  gazetteQuote: { color: '#1a1a1a', fontSize: 17, fontWeight: '700', fontStyle: 'italic', lineHeight: 24, marginBottom: 25 },
  gazetteByline: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  gazetteAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#8b000010', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#8b0000', fontWeight: '900', fontSize: 20 },
  bylineName: { color: '#000', fontSize: 15, fontWeight: '800' },
  bylineRole: { color: '#666', fontSize: 12, fontWeight: '600' },
  universityFooter: { alignItems: 'center', padding: 40 },
  footerRule: { height: 2, width: 40, backgroundColor: COLORS.primary, marginBottom: 20, borderRadius: 1 },
  footerLarge: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  footerSmall: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700', marginTop: 8, letterSpacing: 1 },
});

export default WelcomeScreen;
