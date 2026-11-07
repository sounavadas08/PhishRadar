import { ScanResult } from './types';

export const mockResults: Record<string, ScanResult> = {
  safe: {
    url: 'https://github.com',
    final_url: 'https://github.com',
    scanned_at: new Date().toISOString(),
    verdict: 'Safe',
    score: 8,
    reasons: [
      'Standard well-reputed domain with no punycode or homoglyphs.',
      'A+ rated security headers: Strict HSTS, CSP, and X-Frame-Options enabled.',
      'Strong TLS certificate issued by DigiCert with validated Certificate Transparency logs.',
      'Clean threat intelligence records across Google Safe Browsing and PhishTank.'
    ],
    threat: {
      lookalike_detected: false,
      punycode_host: 'github.com',
      ip_host: false,
      suspicious_tld: false,
      tld: '.com',
      subdomain_depth: 0,
      redirect_count: 0,
      suspicious_keywords: [],
      findings: [
        'Domain structure is legitimate and clean.',
        'No deceptive unicode or lookalike character substitution detected.',
        'No odd subdomains or excessive path nesting.'
      ]
    },
    security_headers: {
      grade: 'A+',
      hsts: true,
      csp: true,
      x_frame_options: true,
      x_content_type_options: true,
      referrer_policy: true,
      server_version_leaked: null,
      findings: [
        'HSTS enabled with includeSubDomains and preload directive.',
        'Strict Content-Security-Policy preventing unauthorized script execution.',
        'X-Frame-Options set to DENY to prevent clickjacking.'
      ]
    },
    certificate: {
      valid: true,
      issuer: 'DigiCert Global G2 TLS RSA SHA256 2020 CA1',
      subject: 'github.com',
      signature_algorithm: 'sha256WithRSAEncryption',
      key_size: 2048,
      days_until_expiration: 215,
      days_since_issued: 150,
      ct_log_verified: true,
      flagged_ca: false,
      flagged_reason: null,
      findings: [
        'Valid TLS certificate issued by trusted CA DigiCert.',
        'Certificate Transparency (CT) logs found in Google and Cloudflare logs.',
        'Certificate age is 150 days (not newly created).'
      ]
    },
    intel: {
      community_votes: { safe: 428, malicious: 2 },
      google_safebrowsing: 'Clean',
      phishtank: 'Clean',
      virustotal: 'Clean',
      findings: [
        'Overwhelmingly trusted community reputation (99.5% safe).',
        'Not listed on active phishing or malware blocklists.'
      ]
    }
  },

  suspicious: {
    url: 'https://paypal-update-center.account-login.top',
    final_url: 'https://paypal-update-center.account-login.top/verify',
    scanned_at: new Date().toISOString(),
    verdict: 'Suspicious',
    score: 64,
    reasons: [
      'High-risk brand keywords (paypal, update, login) located in subdomains rather than root domain.',
      'Uncommon high-risk top-level domain (.top) frequently associated with disposable campaigns.',
      'Missing critical security headers (Content-Security-Policy and HSTS).',
      'Certificate issued only 3 days ago via a free automated provider.'
    ],
    threat: {
      lookalike_detected: true,
      punycode_host: 'paypal-update-center.account-login.top',
      ip_host: false,
      suspicious_tld: true,
      tld: '.top',
      subdomain_depth: 2,
      redirect_count: 1,
      suspicious_keywords: ['paypal', 'update', 'account', 'login'],
      findings: [
        'Brand impersonation attempt detected: "paypal" keyword present in subdomains.',
        'High-risk TLD (.top) with high spam correlation.',
        'Multiple subdomain hops designed to disguise origin.'
      ]
    },
    security_headers: {
      grade: 'D',
      hsts: false,
      csp: false,
      x_frame_options: false,
      x_content_type_options: true,
      referrer_policy: false,
      server_version_leaked: 'nginx/1.18.0 (Ubuntu)',
      findings: [
        'Missing HSTS (Strict-Transport-Security) header.',
        'Missing Content-Security-Policy (CSP) allows arbitrary cross-site scripts.',
        'Server version string leaked in response header.'
      ]
    },
    certificate: {
      valid: true,
      issuer: "Let's Encrypt Authority X3",
      subject: 'paypal-update-center.account-login.top',
      signature_algorithm: 'ecdsa-with-SHA256',
      key_size: 256,
      days_until_expiration: 87,
      days_since_issued: 3,
      ct_log_verified: true,
      flagged_ca: false,
      flagged_reason: null,
      findings: [
        'Freshly minted certificate (3 days old), a common indicator for transient phishing setups.',
        'Domain name does not match any legitimate PayPal infrastructure.'
      ]
    },
    intel: {
      community_votes: { safe: 3, malicious: 31 },
      google_safebrowsing: 'Clean',
      phishtank: 'Clean',
      virustotal: 'Flagged',
      findings: [
        '31 community members have flagged this domain as a phishing imitation.',
        'Flagged by 2 security engines on VirusTotal.'
      ]
    }
  },

  malicious: {
    url: 'http://192.168.1.100/chase-online/auth/login.php',
    final_url: 'http://192.168.1.100/chase-online/auth/login.php',
    scanned_at: new Date().toISOString(),
    verdict: 'Malicious',
    score: 95,
    reasons: [
      'Raw IP host used instead of registered domain name to bypass reputation filters.',
      'Unencrypted HTTP connection soliciting financial login credentials.',
      'No SSL/TLS certificate present.',
      'Security headers completely absent (Grade F).',
      'Actively listed on community feeds as a credential harvester.'
    ],
    threat: {
      lookalike_detected: true,
      punycode_host: '192.168.1.100',
      ip_host: true,
      suspicious_tld: false,
      tld: 'N/A (Raw IPv4)',
      subdomain_depth: 0,
      redirect_count: 0,
      suspicious_keywords: ['chase', 'online', 'auth', 'login'],
      findings: [
        'Host is an IPv4 numerical address, a critical indicator of unauthorized rogue servers.',
        'Path contains banking and credential harvesting targets ("chase", "auth", "login").',
        'Direct login script detected without encrypted transport.'
      ]
    },
    security_headers: {
      grade: 'F',
      hsts: false,
      csp: false,
      x_frame_options: false,
      x_content_type_options: false,
      referrer_policy: false,
      server_version_leaked: 'Apache/2.4.41 (Unix)',
      findings: [
        'No security headers found.',
        'Page can be framed in an iframe (clickjacking vulnerability).',
        'Insecure plain-text HTTP protocol.'
      ]
    },
    certificate: {
      valid: false,
      issuer: 'None (Plain HTTP)',
      subject: 'None',
      signature_algorithm: 'None',
      key_size: 0,
      days_until_expiration: 0,
      days_since_issued: 0,
      ct_log_verified: false,
      flagged_ca: true,
      flagged_reason: 'No SSL/TLS certificate installed on host.',
      findings: [
        'Unencrypted connection (HTTP). Any submitted credentials can be intercepted in transit.'
      ]
    },
    intel: {
      community_votes: { safe: 0, malicious: 89 },
      google_safebrowsing: 'Flagged',
      phishtank: 'Flagged',
      virustotal: 'Flagged',
      findings: [
        'Flagged by Google Safe Browsing as Deceptive Site.',
        'Confirmed PhishTank active phishing submission #829104.',
        '89 community reports confirming active banking credential theft.'
      ]
    }
  }
};

