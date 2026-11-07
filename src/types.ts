export type Verdict = 'Safe' | 'Suspicious' | 'Malicious';

export interface ThreatAnalysis {
  lookalike_detected: boolean;
  punycode_host: string;
  ip_host: boolean;
  suspicious_tld: boolean;
  tld: string;
  subdomain_depth: number;
  redirect_count: number;
  suspicious_keywords: string[];
  findings: string[];
}

export interface SecurityHeaders {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  hsts: boolean;
  csp: boolean;
  x_frame_options: boolean;
  x_content_type_options: boolean;
  referrer_policy: boolean;
  server_version_leaked: string | null;
  findings: string[];
}

export interface CertificateValidation {
  valid: boolean;
  issuer: string;
  subject: string;
  signature_algorithm: string;
  key_size: number;
  days_until_expiration: number;
  days_since_issued: number;
  ct_log_verified: boolean;
  flagged_ca: boolean;
  flagged_reason: string | null;
  findings: string[];
}

export interface CollaborativeIntel {
  community_votes: {
    safe: number;
    malicious: number;
  };
  google_safebrowsing: 'Clean' | 'Flagged' | 'Unavailable';
  phishtank: 'Clean' | 'Flagged' | 'Unavailable';
  virustotal: 'Clean' | 'Flagged' | 'Unavailable';
  findings: string[];
}

export interface ScanResult {
  url: string;
  final_url?: string;
  scanned_at: string;
  verdict: Verdict;
  score: number; // 0 (Safe) to 100 (Malicious)
  reasons: string[];
  threat: ThreatAnalysis;
  security_headers: SecurityHeaders;
  certificate: CertificateValidation;
  intel: CollaborativeIntel;
}

export interface CommunityReportInput {
  url: string;
  vote: 'safe' | 'malicious';
  category?: string;
  comment?: string;
}

