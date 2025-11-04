import { VipLevel } from "../components/VIPScreen";

export interface CrawlTask {
  id: string;
  name: string;
  imageSrc: string;
  price: number;
  income: number;
}

export const customizableTaskIds: { [key: number]: string[] } = {
    1: ['ct_free', 'ct1', 'ct2'],
    2: ['ct_s2_free', 'ct_s2_1', 'ct_s2_2'],
    3: ['ct_s3_free', 'ct_s3_1', 'ct_s3_2'],
};

export interface RechargeCurrency {
  id: string; // e.g., 'usdt'
  name: string; // e.g., 'USDT'
  iconUrl: string;
  networks: string[];
}

export interface Message {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  recipientId: 'all' | number;
  params?: Record<string, string | number>;
}

export interface User {
  id: number;
  email: string;
  phone?: string;
  passwordHash: string;
  mockPassword?: string;
  mainBalance: number;
  withdrawalBalance: number;
  vipLevel: string;
  status: 'active' | 'banned';
  registrationDate: string;
  lastLogin: string;
  ipAddress: string;
  invitationCode: string;
  invitedBy?: string;
  rechargeAmount: number;
  rechargeCommission: number;
  taskCommission: number;
  totalWithdrawals: number;
  taskNextAvailableAt: number | null;
  avatarUrl: string;
  safeBoxImageUrl: string;
  withdrawalFeePercentageOverride?: number;
  commissionRatesOverride?: { [key: number]: number };
  isCrawlerEnabled?: boolean;
  isWithdrawalEnabled: boolean;
  crawlSets?: {
      [setIndex: number]: {
          enabled: boolean;
          activeTaskIds: string[];
          completedTasks: {taskId: string, timestamp: string}[];
          taskOverrides?: { [taskId: string]: { price?: number; income?: number } };
      }
  }
  loginStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  readMessageIds: number[];
}

export interface RechargeRequest {
    id: number;
    userId: number;
    userEmail: string;
    amount: number;
    currency: string;
    network: string;
    paymentProof: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface WithdrawalRequest {
    id: number;
    userId: number;
    userEmail: string;
    amount: number; // The amount in the currency of withdrawal (e.g., 0.1 ETH)
    usdtValue: number; // The equivalent value in USDT at the time of request
    grossUsdtValue: number;
    currency: string;
    network: string;
    address: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Transaction {
  id: number;
  userId: number;
  account: 'main' | 'withdrawal';
  type: 'recharge' | 'vip_purchase' | 'withdrawal' | 'task_income' | 'referral_commission' | 'system_bonus' | 'withdrawal_refund' | 'withdrawal_fee' | 'crawl_task_purchase' | 'login_reward' | 'tx_admin_deduction' | 'tx_admin_addition';
  description: string; // This will be the translation key, e.g., 'tx_recharge'
  amount: number;
  timestamp: string;
  metadata?: {
    vipLevel?: string;
  };
}


export interface PlatformSettingsData {
    name: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    headerColor: string;
    cardColor: string;
    iconColor: string;
    customerServiceName: string;
    customerServiceLink: string;
    customerServiceIconUrl: string;
    minWithdrawal: number;
    maxWithdrawal: number;
    withdrawalFeePercentage: number;
    globalWithdrawalLock: boolean;
    userAvatarUrls: string[];
    safeBoxImageUrls: string[];
    companyProfileText: string;
    companyProfileImages: string[];
    homeCarouselImages: string[];
    homeMarqueeText: string;
    referralDomain: string;
    commissionRates: { [key: number]: number };
    rechargeCurrencies: RechargeCurrency[];
    loginRewards: { day: number, amount: number }[];
    homeIconImages?: { [key: string]: string };
    homeIconColors: { [key: string]: { from: string; to: string } };
}

export interface VipCrawlTaskOverrides {
    [vipLevelName: string]: { // Use vipLevel.name as key
        [setIndex: number]: {
            [taskId: string]: Partial<CrawlTask>;
        }
    }
}

export interface Activity {
    id: string;
    title: string;
    icon: string;
    amount: number;
    taskContent: string;
    taskSteps: string;
}

export interface ActivitySubmission {
    id: number;
    userId: number;
    userEmail: string;
    activityId: string;
    activityTitle: string;
    sampleImage: string; // base64
    completionNotes: string;
    submissionDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

function _0xDEOBFUSCATE(data: string): string {
    try {
        if (!data) return '';
        const reversed = data.split('').reverse().join('');
        return atob(reversed);
    } catch (e) {
        return '';
    }
}

class MockDatabase {
    users: User[] = [];
    vipLevelsData: VipLevel[] = [];
    crawlTaskPools: { [key: number]: CrawlTask[] } = {};
    vipCrawlTaskSettings: VipCrawlTaskOverrides = {};
    activitiesData: Activity[] = [];
    activitySubmissions: ActivitySubmission[] = [];
    private nextSubmissionId = 1;
    pendingRecharges: RechargeRequest[] = [];
    withdrawalRequests: WithdrawalRequest[] = [];
    transactions: Transaction[] = [];
    messages: Message[] = [];
    private nextTransactionId = 1;
    private nextMessageId = 1;
    walletAddresses: Record<string, Record<string, { address: string; qrCodeUrl: string; }>> = {};
    platformSettings: PlatformSettingsData = {
        name: 'Nadec',
        logoUrl: '/images/logo.svg',
        faviconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM3ZTIyY2UiLz48cGF0aCBkPSJNMjUuNCA1SDIxLjI0bDIuMSAzLjFMMTYgMTQuNjMgOS40IDguMSAxMS41IDVINC4zNEw1IDguNzV2OS44YzAgLjg0LjY2IDEuNSAxLjUgMS41aDE4Yy44NCAwIDEuNS0uNjYgMS41LTEuNVY4Ljc1TDI1LjQgNXoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
        primaryColor: '#7e22ce',
        secondaryColor: '#be185d',
        headerColor: '#2f1a63',
        cardColor: '#1c0f3b',
        iconColor: '#ffffff',
        customerServiceName: 'Nadec Support',
        customerServiceLink: 'https://t.me/example',
        customerServiceIconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIGQ9Ik0zIDEzaDJ2NEgzdi00eiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTE5IDEzaDJ2NGgtMnYtNHoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOCAxM3YtMmE2IDYgMCAwMC0xMiAwdjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik05IDE3YTMgMyAwIDAwNiAwIiBzdHJva2UtbGluZWNhcD0icm9uWQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTUgMTF2NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+',
        minWithdrawal: 9,
        maxWithdrawal: 99999,
        withdrawalFeePercentage: 0.5,
        globalWithdrawalLock: true,
        userAvatarUrls: ['https://i.ibb.co/3s4wz9c/nft-avatar.png'],
        safeBoxImageUrls: ['https://i.ibb.co/L6033z6/safe-box.png'],
        companyProfileText: `المقدمة: 1. كيفية إيداع الأموال في منصة Nadec:
مدعومة USDT/TRX للتسجيل، تم حظر القنوات الأخرى مؤقتًا. معظم الإيداعات الإلزامية في المملكة العربية السعودية: TRC-20/BEP-20
يرجى الانتباه إلى عملة التداول الأمريكية المشفرة أو الأموال الافتراضية USDT لجميع المستخدمين الجدد. المبلغ: TRC-20/BEP-20 يتم تحويل الأموال على قنوات العملات الرقمية أو يتم خصمها باستخدام (1 USDT = 1)
للانتقال، لإرسال الأموال من محفظة أخرى أو محفظة عملات رقمية، تحتاج إلى النسخ ولصق Nadec TRC-20/BEP-20، حيث يتم الإرسال إلى منصة Nadec.
وأخيرًا، للحصول على منصة التراخيص المعتمدة، منصة التداول العالمي مرخصة: 30 دقيقة بعد ذلك، يمكنك إيداع الأموال في محفظتك على منصة Nadec للانضمام.

للانضمام: 1. مدفوعات داخل المنصة لمرة واحدة على منصة Nadec
أ. عند عملية الإيداع، يجب عليك التأكد من صحة محفظة الوجهة والبروتوكول. وإذا كان المبلغ المدفوع غير صحيح، فلن نتمكن من تعويضه.
ب. أثناء عملية الإيداع، قد تستغرق العملية بضع دقائق، وقد يستغرق ذلك أكثر من 5 دقائق. إذا لم تتلقى الأموال في ذلك الوقت، يرجى حذف وإعادة إرسال المستند.

للانضمام: 2. مدفوعات داخل منصة التعدين على منصة Nadec
Calibre Mining. عند السحب، عليك اختيار نوع الإيداع على منصة السحب المختلفة. ومتابعة جدول عمليات السحب من منصة 3
حسب أموالك الرقمية في محفظتك على منصة العملات المشفرة، قد تختار ما يلي:
أ. حدد عنوان المحفظة في منصة التداول الرقمي التي تودع فيها أموالك. وانسخ والصق الشاشة
للاختيار، وحدد الفئة المماثلة وفئة محفظة الإيداع الأولية في منصة Nadec. ب. أثناء عملية السحب من منصة Nadec
بعد تأكيد المعاملة والعنوان، انقر على "موقع الويب" لنسخ رابط Calibre Mining URL. ج. أدخل الرابط المنسخ في عمود عنوان URL (تأكد من إمكانية بحث الرابط أثناء عملية السحب)
هو روبوت تجارة ذكي للعقود يعمل بتقنية Nadec AI يمكنك استخدامه من أي بلد، في أي وقت وفي أي مكان. يستغرق الأمر 30 يومًا ليعكس الانخفاض.
للحصول على الاعتماد، على سبيل المثال، يمكنك سداد المبلغ. بعد ذلك، يمكنك تجميع جميع الأوراق. تشمل المزايا: Nadec تضمن لك
الحصول على دعوة مضمونة على الأقل من خلال الإيداع الأولي. وإذا لم تكن Nadec قد تأسست، فستساعدك المنصة. كل روبوتات
العملات الموثوقة والمدرجة في جدول الروبوتات هي من المستخدمين. تتميز روبوتات العملات الرقمية القوية بالشفافية. إنه في هذه الورقة البيضاء
المرخصة. يجب على العميل العمل بمسؤوليته ووفقًا لتقديره. إذا كنت ترغب
الله الغني، سيتم الإفراج عن 7 أيام عمل. سيتم إرسال العمولة الصافية إلى الأفراد. سيتم تحويل عمولة الأفراد. ثم اكتشف روبوتك
سيتم تجميد محفظة Nadec ثم إلغاء تجميدها.`,
        companyProfileImages: [
            '/images/nadec-product.png',
            'https://i.ibb.co/3zdYjJj/trophy1.png',
            'https://i.ibb.co/hZ5FYYN/award.png',
            'https://i.ibb.co/K2H3P0t/certificate.png',
            'https://i.ibb.co/pwnPZtM/trophy2.png',
        ],
        homeCarouselImages: [
            'https://i.ibb.co/yN0m9N2/carousel-1.png',
            'https://i.ibb.co/L8yX7M6/carousel-2.png',
            'https://i.ibb.co/fDbK8Yv/carousel-3.png',
            'https://i.ibb.co/MfZtSgS/carousel-4.png',
        ],
        homeMarqueeText: "1. Seize this NADEC milk opportunity!",
        referralDomain: '',
        commissionRates: {
            1: 12,
            2: 2,
            3: 1,
        },
        rechargeCurrencies: [
            { id: 'usdt', name: 'USDT', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDMyQzcuMTYzIDMyIDAgMjQuODM3IDAgMTZTNy4xNjMgMCAxNiAwczE2IDcuMTYzIDE2IDE2LTcuMTYzIDE2LTE2IDE2em0tNS40NS0xOC4zNThoLT MuMzI4di0zLjMyOGgxMi4xNTZ2My4zMjhoLTMuMzI4djEwLjcxNmgtNS41di0xMC43MTZ6IiBmaWxsPSIjMjZBMUIiIGZpbGxSdWxlPSJub256ZXJvIi8+PC9zdmc+', networks: ['TRC20', 'BEP20', 'ERC20', 'POLYGON'] },
            { id: 'usdc', name: 'USDC', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbFJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iIzI3NzVDQSIgY3g9IjE2IiBjeT0iMTYiIHI9IjE2Ii8+PHBhdGggZD0iTTE2LjQ4IDIwLjM3MWExLjkxIDEuOTEgMCAwIDEtMS40OTIuNjU2Yy0xLjI4IDAtMi4yMjgtLjk3MS0yLjIyOC0yLjYxOHYtNC44MThjMC0xLjY0Ni45NDgtMi42MTcgMi4yMjgtMi42MTdhMS45MSAxLjkxIDAgMCAxIDEuNDkyLjY1NjljLjQwNC40MjMuNjMyLjk5Ni42MzIgMS42MzF2LjM3M2gtMy4wNzZ2NC44OWgzLjA3NnY uMzczYzAgLjYzNS0uMjI4IDEuMjA4LS42MzIgMS42MzF6bS0xLjQ5Mi03LjY2OGMtLjYxNiAwLTEuMDQ0LjQ3LTEuMDQ0IDEuMzkzdjQuODE4YzAgLjkyMi40MjggMS4zOTMgMS4wNDQgMS4zOTMuNjE2IDAgMS4wNDQtLjQ3IDEuMDQ0LTEuMzkzdi00LjgxOGMwLS45MjItLjQyOC0xLjM5My0xLjA0NC0xLjM5M3ptNi4zOC0yLjM0NWMuNDQuNDA0LjY4Ljk2LjY4IDEuNTgzdjUuODk0YzAgLjYyNC0uMjQgMS4xOC0uNjggMS41ODNhMS44NiAxLjg2IDAgMCAxLTEuNDY0LjYzMiAyLjAxIDIwMSAyLjAxIDAgMCAxLTEuNTItLjY2NGMtLjQyNC0uNDMxLS42NTctMS4xLS42NTctMS42M3YtNS44M2MwLS42Mi4yMzMtMS4xOTkuNjU2LTEuNjNhMi4wMSAyLjAxIDAgMCAxIDEuNTItLjY2NWMuNTc2IDAgMS4wOC4yMjMgMS40NjQuNjMyek0yMC4zMTIgMTZjMCAuODIzLS4zOTIgMS4yNjQtMS4wMTYgMS4yNjRzLTEuMDE2LS40NC0xLjAxNi0xLjI2NGMwLS44MjMuMzkyLTEuMjY0IDEuMDE2LTEuMjY0czEuMDE2LjQ0IDEuMDE2IDEuMjY0eiIgZmlsbD0iI0ZGRiIvPjwvZz48L3N2Zz4=', networks: ['TRC-20', 'BEP-20', 'ERC-20', 'POLYGON'] },
            { id: 'bnb', name: 'BNB', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAIDE2TDggOGw4IDgtOCA4em0xNi04bDggOC04IDhWOHoiIGZpbGw9IiNGM0JBMkYiLz48cGF0aCBkPSJNOCAyNGw4IDggOC04LTgtOHptOC0xNkw4IDBsLTggOCA4IDh6IiBmaWxsPSIjRjNCQTJGIi8+PHBhdGggZD0iTTE2IDExLjMxNUwxMy42NTcgOS4wMWwtMi4zNDMgMi4yOTUgNC42ODYgNC42NSA0LjY4NS00LjY1bC0yLjM0Mi0yLjI5NXoiIGZpbGw9IiNGM0JBMkYiLz48L3N2Zz4=', networks: ['BEP20'] },
            { id: 'trx', name: 'TRX', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDwbDEzLjg1NiA4djE2TDE2IDMyIDIuMTQ0IDI0VjhabTkuNTEzIDEwLjkzMmwtOS40NTMgNS40MzMtMi42MTcgMS41LTYuNzktMy45MlY4Ljk3bDkuNDA3LTUuNDMyIDkuNDUzIDUuNDV2NS45NDR6bS0xOS4wMjYgNC4xbDYuNzkgMy45MiA2Ljg0OC0zLjk1M3Y3LjA1TDEwLjUgMjcuNTMydi02LjU1NmwtLjAyNi4wMTV6IiBmaWxsPSIjRUIwMDI5Ii8+PC9zdmc+', networks: ['TRC20'] },
            { id: 'eth', name: 'ETH', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbFJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iIzYyN0VFQSIgY3g9IjE2IiBjeT0iMTYiIHI9IjE2Ii8+PGcgZmlsbD0iI0ZGRiIgZmlsbFJ1bGU9Im5vbnplcm8iPjxwYXRoIG9wYWNpdHk9Ii42MDIiIGQ9Ik0xNi40OTggNHY4Ljg3bDcuNDk3IDMuMzV6Ii8+PHBhdGggZD0iTTE2LjQ5OCA0TDkgMTYuMjJsNy40OTgtMy4zNXoiLz48cGF0aCBvcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDIxLjk2OHY2LjAyN0wyNCAxNy42MTZ6Ii8+PHBhdGggZD0iTTE2LjQ5OCAyNy45OTV2LTYuMDI3TDkgMTcuNjE2eiIvPjxwYXRoIG9wYWNpdHk9Ii4yIiBkPSJNMTYuNDk4IDIwLjU3M2w3LjQ5Ny00LjM1My03LjQ5Ny0zLjM0OHoiLz48cGF0aCBvcGFjaXR5PSIuNjAyIiBkPSJNOSAxNi4yMmw3LjQ5OCA0LjM1M3YtNy43MDF6Ii8+PC9nPjwvZz48L3N2Zz4=', networks: ['ERC20'] },
            { id: 'matic', name: 'MATIC', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyLjU4MyA2LjAwOEwxNi40NCAyLjEzMmExLjk0IDEuOTQgMCAwMC0xLjYzMiAwbC02LjE0MyAzLjg3NmExLjkyIDEuOTIgMCAwMC0uOTc2IDEuNjg0djEwLjU5OGMwIC43LjM4NCAxLjM0OC45NzYgMS42ODRsNi4xNDIgMy44NzZjLjUuMzE2IDEuMTMyLjMxNiAxLjYzMiAwbDYuMTQyLTMuODc2Yy41OTItLjMzNi45NzYtLjk4NC45NzYtMS42ODRWNy42OTJhMS45MiAxLjkxIDAgMDAtLjk3Ni0xLjY4NHptLTIuMDggMTEuMjMybC0zLjg5NiAyLjM5LTMuODgtMi4zOVYxMi45bDMuODgtMi4zOSAzLjg5NiAyLjM5djQuMzR6IiBmaWxsPSIjODI0N0U1Ii8+PC9zdmc+', networks: ['POLYGON'] },
            { id: 'pyusd', name: 'PYUSD', iconUrl: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbFJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iIzAwMjg2OCIgY3g9IjE2IiBjeT0iMTYiIHI9IjE2Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTExLjgzIDIzLjYxOVY4aDMuMDR2MTIuNzVoNC40MnYyLjg2OWgtNy40NnoiLz48L2c+PC9zdmc+', networks: ['ERC20'] },
        ],
        loginRewards: [
            { day: 9, amount: 0.88 },
            { day: 10, amount: 0.88 },
            { day: 11, amount: 0.88 },
            { day: 12, amount: 0.88 },
            { day: 13, amount: 0.88 },
            { day: 26, amount: 1.88 },
            { day: 27, amount: 1.88 },
            { day: 28, amount: 1.88 },
            { day: 29, amount: 1.88 },
        ],
        homeIconColors: {
            recharge: { from: '#fb923c', to: '#ef4444' },
            withdraw: { from: '#fb923c', to: '#ef4444' },
            appDownload: { from: '#fb923c', to: '#ef4444' },
            companyProfile: { from: '#fb923c', to: '#ef4444' },
            inviteFriends: { from: '#fb923c', to: '#ef4444' },
            agencyCooperation: { from: '#fb923c', to: '#ef4444' },
        },
        homeIconImages: {
            recharge: 'https://i.ibb.co/Q8Q9YpL/recharge.png',
            withdraw: 'https://i.ibb.co/JqjT2Wp/withdraw.png',
            appDownload: 'https://i.ibb.co/yQjGZ5d/app-download.png',
            companyProfile: 'https://i.ibb.co/R4j4Xf9/company-profile.png',
            inviteFriends: 'https://i.ibb.co/gR7tXyD/invite-friends.png',
            agencyCooperation: 'https://i.ibb.co/b3WjV0Q/agency-cooperation.png',
        },
    };

    constructor() {
        this.initializeData();
        this.seedTransactions();
    }
    
    adminAdjustBalance(userId: number, amount: number, account: 'main' | 'withdrawal', action: 'add' | 'deduct'): { success: boolean; message?: string } {
        const user = this.findUserById(userId);
        if (!user) {
          return { success: false, message: 'errorUserNotFound' };
        }

        const transactionType: 'tx_admin_addition' | 'tx_admin_deduction' = action === 'add' ? 'tx_admin_addition' : 'tx_admin_deduction';
        const amountToApply = action === 'add' ? amount : -amount;

        if (account === 'main') {
          if (action === 'deduct' && user.mainBalance < amount) {
            return { success: false, message: 'deductionAmountGreaterThanBalance' };
          }
          user.mainBalance += amountToApply;
        } else { // withdrawal
          if (action === 'deduct' && user.withdrawalBalance < amount) {
            return { success: false, message: 'deductionAmountGreaterThanBalance' };
          }
          user.withdrawalBalance += amountToApply;
        }

        this.addTransaction({
          userId,
          account,
          type: transactionType,
          description: transactionType,
          amount: amountToApply,
        });

        return { success: true };
    }

    initializeData() {
        this.addMessage({
            title: 'systemNotice',
            content: `السعر الآن للحصول على مكافأة المهمة بقيمة 4 دولارات أمريكية من المستوى الأول من اللعب.
01/11/2025 18:08:13

السعر الآن للحصول على مكافأة المهمة بقيمة 4 دولارات أمريكية، وإذا بدأت من اللعب.
السعر في سجل الحصول للمهمة إلى 888 يومًا، وستحصل على مكافأة تصل إلى 888 دولارًا أمريكيًا.

مشاركة VIP خطط
التسجيل والحصول على مكافأة تصل إلى 288 دولارًا أمريكيًا في مشاركة أعضاء المستوى.
دعوة 50 شخصًا، مكافأة 15 دولارًا (1)
دعوة 100 شخصًا، مكافأة 30 دولارًا (2)
دعوة 300 شخصًا، مكافأة 30 دولارًا (3)
دعوة 1000 شخصًا، مكافأة 30 دولارًا (4)

تذكر، قم بالدخول إلى التطبيق الاحترافي للدعوة، ودعوة الأصدقاء من المستوى العالي للحصول على مكافآت سخية في المسابقات المالية.
للحصول على تفاصيل الحدث، يرجى من جميع الأصدقاء في الفريق من جميع أنحاء العالم الاتصال بفريق خدمة العملاء.
عندما تدعو أعضاء أكثر من 198 دولارًا أمريكيًا، ستحصل على مكافأة أخرى من المستوى Lucky Wheel، كما يمكنك المشاركة في حدث.
وهذه المشاركة مرة واحدة فقط، والربح يأتي في 4988 دولارًا أمريكيًا!

خصم إعادة شحن الفريق
%12 خصم أعضاء المستوى A
%2 خصم أعضاء المستوى B
%1 خصم أعضاء المستوى C`,
            recipientId: 'all'
        });

        this.activitiesData = [
            {
                id: '1',
                title: 'للتسجيل واحصل على مكافأة ثابتة تصل إلى 288 دولارًا أمريكيًا. شارك وادع أعضاء المستوى A.',
                icon: 'https://i.ibb.co/L8yX7M6/carousel-2.png',
                amount: 288,
                taskContent: `للتسجيل واحصل على مكافأة ثابتة تصل إلى ۲۸۸ دولارًا أمريكيًا (A-LEVEL) شارك وادع أعضاء المستوى المتقدم
ادع ٥٠ شخصًا، مكافأة ١٥ دولارًا أمريكيًا (تستحق كل ٧ أيام)
ادع ١٠٠ شخصًا، مكافأة ٣٠ دولارًا أمريكيًا (تستحق كل ٧ أيام)
ادع ٣٠٠ شخصًا، مكافأة ٩٠ دولارًا أمريكيًا (تستحق كل ٧ أيام)
ادع ١٠٠٠ شخص، مكافأة ٢٨٨ دولارًا أمريكيًا (تستحق كل ٧ أيام)
:التعليمات
١. (A-LEVEL) متطلبات التقديم: يجب أن يكون الداعي عضوًا في المستوى المتقدم
٢. تدفع الشركة الراتب الأساسي ثلاث مرات شهريًا في أيام ٧، ١٤، و ٢١ من كل شهر.
٣. بعد إتمام عملية الدعوة، يُرجى تقديم طلب استمرار دعوة الأشخاص سيسرع من مراجعة طلبك والموافقة عليه.
٤. يُرجى التأكد من أن دعواتك حقيقية. الدعوات المزيفة ستؤدي إلى حظر دائم وإلغاء جميع المكافآت.`,
                taskSteps: `١. اضغط على الفريق للحصول على رابط الدعوة الحصري.
٢. شارك رابط الدعوة على واتساب، فيسبوك، يوتيوب، تيك توك، إنستغرام، تويتر، تيليجرام، إعلانات جوجل وإعلانات وسائل التواصل الاجتماعي.`
            },
            { id: '2', title: 'ادع 5 أصدقاء خلال 24 ساعة، وكل شخص يشحن 18 دولارًا لتحصل على مكافأة 9 دولارات!', icon: 'https://i.ibb.co/L8yX7M6/carousel-2.png', amount: 9, taskContent: 'محتوى مفصل للمهمة الثانية', taskSteps: 'خطوات مفصلة للمهمة الثانية' },
            { id: '3', title: 'ادع 5 أصدقاء خلال 24 ساعة، وكل شخص يشحن 198 دولارًا لتحصل على مكافأة 99 دولارًا!', icon: 'https://i.ibb.co/L8yX7M6/carousel-2.png', amount: 99, taskContent: 'محتوى مفصل للمهمة الثالثة', taskSteps: 'خطوات مفصلة للمهمة الثالثة' },
        ];

        // Init Crawl tasks
        this.crawlTaskPools = {
            1: [
                { id: 'ct_free', name: 'Free Task', imageSrc: 'https://i.ibb.co/L9L6w4b/resistor.png', price: 0, income: 0.5 },
                { id: 'ct1', name: 'Resistor 330 Ohm', imageSrc: 'https://i.ibb.co/L9L6w4b/resistor.png', price: 21.06, income: 9.47 },
                { id: 'ct2', name: 'Capacitor 10uF', imageSrc: 'https://i.ibb.co/L9L6w4b/resistor.png', price: 50, income: 15 },
            ],
            2: [
                { id: 'ct_s2_free', name: 'Free Task Set 2', imageSrc: 'https://i.ibb.co/yQJ4c2b/diode.png', price: 0, income: 1.0 },
                { id: 'ct_s2_1', name: 'Diode Pack', imageSrc: 'https://i.ibb.co/yQJ4c2b/diode.png', price: 75, income: 25 },
                { id: 'ct_s2_2', name: 'Transistor Kit', imageSrc: 'https://i.ibb.co/yQJ4c2b/diode.png', price: 100, income: 35 },
            ],
            3: [
                { id: 'ct_s3_free', name: 'Free Task Set 3', imageSrc: 'https://i.ibb.co/Rzbd9k9/breadboard.png', price: 0, income: 1.5 },
                { id: 'ct_s3_1', name: 'Breadboard Kit', imageSrc: 'https://i.ibb.co/Rzbd9k9/breadboard.png', price: 150, income: 50 },
                { id: 'ct_s3_2', name: 'Power Supply Module', imageSrc: 'https://i.ibb.co/Rzbd9k9/breadboard.png', price: 200, income: 70 },
            ]
        };
        
        // Init VIP Crawl Settings
        this.vipCrawlTaskSettings = {
            'Nadec2': { // VIP level name
                1: { // setIndex
                    'ct_free': { income: 1.0 } // taskId: override
                }
            }
        };

        // Init Wallet Addresses (obfuscated)
        this.walletAddresses = {
            'USDT': {
                'TRC20': { address: 'yB1QX1zcGVyZGRBZXRhRl9URFNVXzAyQ1JUV', qrCodeUrl: '' },
                'BEP20': { address: 'RDNDX3NzZXJkZEFrYWZfVERTVV8wMlBFQg==', qrCodeUrl: '' },
                'ERC20': { address: 'RjRGX3NzZXJkZEFrYWZfVERTVV8wMkNSRQ==', qrCodeUrl: '' },
                'POLYGON': { address: 'N0hHX3NzZXJkZEFrYWZfVERTVV9OT0dZTFBPTA==', qrCodeUrl: '' },
            },
            'USDC': {
                'TRC-20': { address: 'MkkyX3NzZXJkZEFrYWZfQ0RTVV8wMkNSRQ==', qrCodeUrl: '' },
                'BEP-20': { address: 'NEs0X3NzZXJkZEFrYWZfQ0RTVV8wMlBFQg==', qrCodeUrl: '' },
                'ERC-20': { address: 'Nkw2X3NzZXJkZEFrYWZfQ0RTVV8wMkNSRQ==', qrCodeUrl: '' },
                'POLYGON': { address: 'OE04X3NzZXJkZEFrYWZfQ0RTVV9OT0dZTFBPTA==', qrCodeUrl: '' },
            },
            'BNB': { 'BEP20': { address: '==Qk5CX3NzZXJkZEFrYWZfQk5CXzAyUEVC', qrCodeUrl: '' } },
            'TRX': { 'TRC20': { address: 'WFJUX3NzZXJkZEFrYWZfWFJUXzAyQ1JUV', qrCodeUrl: '' } },
            'ETH': { 'ERC20': { address: 'SFRFX3NzZXJkZEFrYWZfSFRFXzAyQ1JFU', qrCodeUrl: '' } },
            'MATIC': { 'POLYGON': { address: 'Q0lUQU1fc3NlcmRkQWthZl9DSVRBTV9OT0dZTFBPTA==', qrCodeUrl: '' } },
            'PYUSD': { 'ERC20': { address: 'RFNVWVZfc3NlcmRkQWthZl9EU1VZVl8wMkNSRQ==', qrCodeUrl: '' } }
        };

        // Init VIP Levels
        this.vipLevelsData = [
            { id: 'nadec1', name: 'Nadec1', imageSrc: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300', tasks: 1, benefit: 4.00, dailyProfit: 4.00, totalProfit: 1460, status: 'active', effectiveTime: '2024.01.01-2025.01.01', unlockCost: 0 },
            { id: 'nadec2', name: 'Nadec2', imageSrc: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=300', tasks: 1, benefit: 9.00, dailyProfit: 9.00, totalProfit: 3285, status: 'locked', unlockCost: 18 },
            { id: 'nadec3', name: 'Nadec3', imageSrc: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300', tasks: 1, benefit: 40, dailyProfit: 40, totalProfit: 14600, status: 'locked', unlockCost: 68 },
            { id: 'nadec4', name: 'Nadec4', imageSrc: 'https://images.unsplash.com/photo-1525904097-15d8831c3c35?w=300', tasks: 1, benefit: 124, dailyProfit: 124, totalProfit: 45260, status: 'locked', unlockCost: 138 },
            { id: 'nadec5', name: 'Nadec5', imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', tasks: 1, benefit: 328, dailyProfit: 328, totalProfit: 119720, status: 'locked', unlockCost: 568 },
            { id: 'nadec6', name: 'Nadec6', imageSrc: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=300', tasks: 1, benefit: 688, dailyProfit: 688, totalProfit: 251120, status: 'locked', unlockCost: 1088 },
            { id: 'nadec7', name: 'Nadec7', imageSrc: 'https://i.ibb.co/k2V3sZ5/nadec-product.png', tasks: 1, benefit: 1530.00, dailyProfit: 1530.00, totalProfit: 558450.00, status: 'locked', unlockCost: 2330.00, },
        ];
        
        // Init Users (with obfuscated passwords)
        const defaultCrawlSets = {
            1: { enabled: false, activeTaskIds: [], completedTasks: [] },
            2: { enabled: false, activeTaskIds: [], completedTasks: [] },
            3: { enabled: false, activeTaskIds: [], completedTasks: [] },
        };
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        this.users = [
            { id: 1, email: 'maylooj@gmail.com', passwordHash: 'hash', mockPassword: '=MzJxdHJvZHdzcGFj', mainBalance: 0.00, withdrawalBalance: 4.6807, vipLevel: 'Nadec1', status: 'active', registrationDate: '2023-10-01T10:00:00Z', lastLogin: new Date().toISOString(), ipAddress: '192.168.1.1', invitationCode: '9p8pgu', invitedBy: 'admin', rechargeAmount: 50, rechargeCommission: 5, taskCommission: 1.5, totalWithdrawals: 20, taskNextAvailableAt: null, avatarUrl: this.platformSettings.userAvatarUrls[0], safeBoxImageUrl: this.platformSettings.safeBoxImageUrls[0], withdrawalFeePercentageOverride: 0.25,
              isCrawlerEnabled: false, isWithdrawalEnabled: false,
              crawlSets: {
                  ...defaultCrawlSets,
                  1: { ...defaultCrawlSets[1], enabled: true }
              },
              loginStreak: 8,
              lastLoginDate: yesterday.toISOString().split('T')[0],
              readMessageIds: [],
            },
            { id: 2, email: 'john.doe@example.com', passwordHash: 'hash', mockPassword: 'NjU0ZHJvd3NzYXBj', mainBalance: 0, withdrawalBalance: 150.75, vipLevel: 'Nadec2', status: 'active', registrationDate: '2023-10-02T11:00:00Z', lastLogin: new Date().toISOString(), ipAddress: '192.168.1.2', invitationCode: 'abcdef', invitedBy: '9p8pgu', rechargeAmount: 18.10, rechargeCommission: 2.172, taskCommission: 0, totalWithdrawals: 10, taskNextAvailableAt: Date.now() + (12 * 60 * 60 * 1000), avatarUrl: this.platformSettings.userAvatarUrls[0], safeBoxImageUrl: this.platformSettings.safeBoxImageUrls[0], isCrawlerEnabled: false, isWithdrawalEnabled: false, crawlSets: defaultCrawlSets,
              loginStreak: 0,
              lastLoginDate: '',
              readMessageIds: [],
            },
            { id: 3, email: 'jane.doe@example.com', passwordHash: 'hash', mockPassword: 'OTg3ZHJvd3NzYXBj', mainBalance: 0, withdrawalBalance: 0, vipLevel: 'Nadec1', status: 'banned', registrationDate: '2023-10-03T12:00:00Z', lastLogin: new Date().toISOString(), ipAddress: '192.168.1.3', invitationCode: 'ghijkl', invitedBy: '9p8pgu', rechargeAmount: 0, rechargeCommission: 0, taskCommission: 0, totalWithdrawals: 0, taskNextAvailableAt: null, avatarUrl: this.platformSettings.userAvatarUrls[0], safeBoxImageUrl: this.platformSettings.safeBoxImageUrls[0], isCrawlerEnabled: false, isWithdrawalEnabled: false, crawlSets: defaultCrawlSets,
              loginStreak: 2,
              lastLoginDate: yesterday.toISOString().split('T')[0],
              readMessageIds: [],
            },
            { id: 4, email: 'test.user@example.com', phone: '1234567890', passwordHash: 'hash', mockPassword: 'c3NhcHRzZXQ=', mainBalance: 0, withdrawalBalance: 50, vipLevel: 'Nadec1', status: 'active', registrationDate: new Date().toISOString(), lastLogin: new Date().toISOString(), ipAddress: '192.168.1.4', invitationCode: 'mnopqr', invitedBy: 'abcdef', rechargeAmount: 100, rechargeCommission: 12, taskCommission: 5, totalWithdrawals: 30, taskNextAvailableAt: Date.now() - (2 * 60 * 60 * 1000), avatarUrl: this.platformSettings.userAvatarUrls[0], safeBoxImageUrl: this.platformSettings.safeBoxImageUrls[0], isCrawlerEnabled: false, isWithdrawalEnabled: false, crawlSets: defaultCrawlSets,
              loginStreak: 1,
              lastLoginDate: new Date().toISOString().split('T')[0], // claimed today
              readMessageIds: [],
            },
            { id: 5, email: 'another.user@example.com', phone: '0987654321', passwordHash: 'hash', mockPassword: 'c3NhcHRoZW5vdGFj', mainBalance: 0, withdrawalBalance: 1000, vipLevel: 'Nadec3', status: 'active', registrationDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), lastLogin: new Date().toISOString(), ipAddress: '192.168.1.5', invitationCode: 'stuvwx', invitedBy: 'ghijkl', rechargeAmount: 500, rechargeCommission: 60, taskCommission: 25, totalWithdrawals: 0, taskNextAvailableAt: null, avatarUrl: this.platformSettings.userAvatarUrls[0], safeBoxImageUrl: this.platformSettings.safeBoxImageUrls[0], isCrawlerEnabled: false, isWithdrawalEnabled: false, crawlSets: defaultCrawlSets,
              loginStreak: 0,
              lastLoginDate: '',
              readMessageIds: [],
            },
        ];

        // Init Recharge Requests
        this.pendingRecharges = [
            { id: 1, userId: 2, userEmail: 'john.doe@example.com', amount: 100, currency: 'USDT', network: 'TRC20', paymentProof: 'https://i.imgur.com/gkwp2Cp.png', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), status: 'pending' },
            { id: 2, userId: 4, userEmail: 'test.user@example.com', amount: 50, currency: 'USDT', network: 'BEP20', paymentProof: 'https://i.imgur.com/gkwp2Cp.png', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'pending' },
        ];
        
        // Init Withdrawal Requests (with obfuscated addresses)
        this.withdrawalRequests = [
            { id: 1, userId: 2, userEmail: 'john.doe@example.com', amount: 10, usdtValue: 10, grossUsdtValue: 10.05, currency: 'USDT', network: 'TRC20', address: 'NlU1X3JkZEFfd2FyZGhrV2xfMDJDQlRUV', date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: 'pending' },
            { id: 2, userId: 4, userEmail: 'test.user@example.com', amount: 25, usdtValue: 25, grossUsdtValue: 25.126, currency: 'USDT', network: 'BEP20', address: 'OEg3X3JkZEFfd2FyZGhrV2xfMDJwZUI=', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), status: 'approved' },
        ];
    }
    
    seedTransactions() {
        this.transactions = [
            // User 1
            { id: this.nextTransactionId++, userId: 1, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 50.00, timestamp: new Date('2025-10-28T15:32:54Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'main', type: 'vip_purchase', description: 'tx_vip_purchase', amount: -18.00, timestamp: new Date('2025-10-28T14:43:50Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'withdrawal', type: 'task_income', description: 'tx_task_income', amount: 4.00, timestamp: new Date('2025-10-28T14:50:30Z').toISOString(), metadata: { vipLevel: 'Nadec1' } },
            { id: this.nextTransactionId++, userId: 1, account: 'withdrawal', type: 'task_income', description: 'tx_task_income', amount: 4.00, timestamp: new Date('2025-10-27T14:00:00Z').toISOString(), metadata: { vipLevel: 'Nadec1' } },
            { id: this.nextTransactionId++, userId: 1, account: 'withdrawal', type: 'referral_commission', description: 'tx_referral_commission', amount: 2.16, timestamp: new Date('2025-10-29T01:38:59Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'withdrawal', type: 'withdrawal', description: 'tx_withdrawal', amount: -11.44, timestamp: new Date('2025-10-29T14:44:20Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 0.18, timestamp: new Date('2025-10-29T23:35:47Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'withdrawal', type: 'system_bonus', description: 'tx_system_bonus', amount: 5.00, timestamp: new Date('2025-10-30T13:52:25Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'withdrawal', type: 'withdrawal', description: 'tx_withdrawal', amount: -11.164, timestamp: new Date('2025-10-30T14:51:06Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 0.36, timestamp: new Date('2025-10-30T23:02:50Z').toISOString() },
            { id: this.nextTransactionId++, userId: 1, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 2.16, timestamp: new Date('2025-10-30T23:27:43Z').toISOString() },
             // User 2
            { id: this.nextTransactionId++, userId: 2, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 1.092, timestamp: new Date('2025-10-27T23:38:30Z').toISOString() },
            { id: this.nextTransactionId++, userId: 2, account: 'main', type: 'vip_purchase', description: 'tx_vip_purchase', amount: -68.00, timestamp: new Date('2025-10-28T13:22:37Z').toISOString() },
            { id: this.nextTransactionId++, userId: 2, account: 'withdrawal', type: 'task_income', description: 'tx_task_income', amount: 9.00, timestamp: new Date('2025-10-28T13:32:50Z').toISOString(), metadata: { vipLevel: 'Nadec2' } },
            { id: this.nextTransactionId++, userId: 2, account: 'withdrawal', type: 'task_income', description: 'tx_task_income', amount: 9.00, timestamp: new Date('2025-10-27T13:00:00Z').toISOString(), metadata: { vipLevel: 'Nadec2' } },
            { id: this.nextTransactionId++, userId: 2, account: 'withdrawal', type: 'withdrawal', description: 'tx_withdrawal', amount: -18.00, timestamp: new Date('2025-10-28T13:33:55Z').toISOString() },
            { id: this.nextTransactionId++, userId: 2, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 0.612, timestamp: new Date('2025-10-29T22:42:02Z').toISOString() },
            { id: this.nextTransactionId++, userId: 2, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 0.458, timestamp: new Date('2025-10-29T22:44:50Z').toISOString() },
            { id: this.nextTransactionId++, userId: 2, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 0.362, timestamp: new Date('2025-10-30T09:18:03Z').toISOString() },
            { id: this.nextTransactionId++, userId: 2, account: 'main', type: 'recharge', description: 'tx_recharge', amount: 0.48, timestamp: new Date('2025-10-30T01:12:15Z').toISOString() },
        ];
    }
    
    addTransaction(txData: Omit<Transaction, 'id' | 'timestamp'>) {
        const newTx: Transaction = {
          ...txData,
          id: this.nextTransactionId++,
          timestamp: new Date().toISOString(),
        };
        this.transactions.unshift(newTx);
    }
    
    getTransactionsForUser(userId: number): Transaction[] {
        return this.transactions.filter(tx => tx.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    addMessage(data: Omit<Message, 'id' | 'timestamp'>) {
        const newMessage: Message = {
            id: this.nextMessageId++,
            timestamp: new Date().toISOString(),
            ...data,
        };
        this.messages.unshift(newMessage);
        return newMessage;
    }

    getMessagesForUser(userId: number): Message[] {
        const user = this.findUserById(userId);
        if (!user) return [];
        return this.messages.filter(msg => msg.recipientId === 'all' || msg.recipientId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    markMessageAsRead(userId: number, messageId: number) {
        const user = this.findUserById(userId);
        if (user && !user.readMessageIds.includes(messageId)) {
            user.readMessageIds.push(messageId);
        }
    }
    
    authenticateUser(email: string, pass: string): User | null {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && user.mockPassword && _0xDEOBFUSCATE(user.mockPassword) === pass) {
            return user;
        }
        return null;
    }

    findUserByEmail(email: string) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    
    findUserById(id: number) {
        return this.users.find(u => u.id === id);
    }
    
    findUserByInvitationCode(code: string): User | undefined {
        return this.users.find(u => u.invitationCode === code);
    }

    addUser(data: { email: string; password: string; invitedBy?: string; }): { success: boolean, message: string } {
        if (this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            return { success: false, message: 'email_exists' };
        }

        const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        const newInvitationCode = Math.random().toString(36).substring(2, 8);
        
        const randomAvatar = this.platformSettings.userAvatarUrls.length > 0
            ? this.platformSettings.userAvatarUrls[Math.floor(Math.random() * this.platformSettings.userAvatarUrls.length)]
            : '';
        const randomSafeBoxImage = this.platformSettings.safeBoxImageUrls.length > 0
            ? this.platformSettings.safeBoxImageUrls[Math.floor(Math.random() * this.platformSettings.safeBoxImageUrls.length)]
            : '';


        const newUser: User = {
            id: newId,
            email: data.email,
            passwordHash: 'hashed_' + data.password, // simulate hashing
            mockPassword: btoa(data.password).split('').reverse().join(''), // Obfuscate password
            mainBalance: 0,
            withdrawalBalance: 0,
            vipLevel: 'Nadec1', // Default starting level
            status: 'active',
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            ipAddress: '127.0.0.1', // mock IP
            invitationCode: newInvitationCode,
            invitedBy: data.invitedBy,
            rechargeAmount: 0,
            rechargeCommission: 0,
            taskCommission: 0,
            totalWithdrawals: 0,
            taskNextAvailableAt: null,
            avatarUrl: randomAvatar,
            safeBoxImageUrl: randomSafeBoxImage,
            isCrawlerEnabled: false,
            isWithdrawalEnabled: false,
            crawlSets: {
                1: { enabled: false, activeTaskIds: [], completedTasks: [] },
                2: { enabled: false, activeTaskIds: [], completedTasks: [] },
                3: { enabled: false, activeTaskIds: [], completedTasks: [] },
            },
            loginStreak: 0,
            lastLoginDate: '',
            readMessageIds: [],
        };
        
        this.users.push(newUser);
        return { success: true, message: 'registration_successful' };
    }

    updateUser(userId: number, updates: Partial<User>) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            // If password is being updated, obfuscate it
            if (updates.mockPassword) {
                updates.mockPassword = btoa(updates.mockPassword).split('').reverse().join('');
            }
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            return true;
        }
        return false;
    }

    toggleWithdrawalStatus(userId: number) {
        const user = this.findUserById(userId);
        if (user) {
            user.isWithdrawalEnabled = !user.isWithdrawalEnabled;
            return true;
        }
        return false;
    }
    
    getWalletAddress(currency: string, network: string): { address: string; qrCodeUrl: string; } | undefined {
        const networkInfo = this.walletAddresses[currency]?.[network];
        if (networkInfo && networkInfo.address) {
            return {
                ...networkInfo,
                address: _0xDEOBFUSCATE(networkInfo.address)
            };
        }
        return networkInfo; // Return as is if address is missing or not found
    }
    
    getWithdrawalRequests(): WithdrawalRequest[] {
        return this.withdrawalRequests.map(req => ({
            ...req,
            address: _0xDEOBFUSCATE(req.address)
        }));
    }

    addRechargeRequest(request: { userId: number; amount: number; currency: string; network: string; paymentProof: string; }) {
        const user = this.users.find(u => u.id === request.userId);
        if (!user) return false;

        const newId = this.pendingRecharges.length > 0 ? Math.max(...this.pendingRecharges.map(r => r.id)) + 1 : 1;
        const newRequest: RechargeRequest = {
            id: newId,
            userId: user.id,
            userEmail: user.email,
            amount: request.amount,
            currency: request.currency,
            network: request.network,
            paymentProof: request.paymentProof,
            date: new Date().toISOString(),
            status: 'pending',
        };
        this.pendingRecharges.unshift(newRequest);
        return true;
    }
    
    addWithdrawalRequest(request: { userId: number; amount: number; usdtValue: number; grossUsdtValue: number; currency: string; network: string; address: string; }): { success: boolean; message?: string } {
        const user = this.users.find(u => u.id === request.userId);
        if (!user) return { success: false, message: 'errorUserNotFound' };

        if (user.withdrawalBalance < request.grossUsdtValue) {
            return { success: false, message: 'insufficientBalance' };
        }

        user.withdrawalBalance -= request.grossUsdtValue;
        user.totalWithdrawals += request.usdtValue;
        
        const fee = request.grossUsdtValue - request.usdtValue;
        
        this.addTransaction({ userId: user.id, account: 'withdrawal', type: 'withdrawal', description: 'tx_withdrawal', amount: -request.usdtValue });
        this.addTransaction({ userId: user.id, account: 'withdrawal', type: 'withdrawal_fee', description: 'tx_withdrawal_fee', amount: -fee });


        const newId = this.withdrawalRequests.length > 0 ? Math.max(...this.withdrawalRequests.map(r => r.id)) + 1 : 1;
        const newRequest: WithdrawalRequest = {
            id: newId,
            userId: user.id,
            userEmail: user.email,
            ...request,
            address: btoa(request.address).split('').reverse().join(''), // Obfuscate address before storing
            date: new Date().toISOString(),
            status: 'pending',
        };
        this.withdrawalRequests.unshift(newRequest);
        return { success: true };
    }

    approveWithdrawal(requestId: number) {
        const reqIndex = this.withdrawalRequests.findIndex(r => r.id === requestId);
        if (reqIndex !== -1 && this.withdrawalRequests[reqIndex].status === 'pending') {
            this.withdrawalRequests[reqIndex].status = 'approved';
            const request = this.withdrawalRequests[reqIndex];
            this.addMessage({
                title: 'tx_withdrawal_success_title',
                content: 'tx_withdrawal_success_content',
                recipientId: request.userId,
                params: {
                    amount: request.usdtValue.toFixed(5),
                    currency: 'USDT'
                }
            });
            return true;
        }
        return false;
    }

    rejectWithdrawal(requestId: number) {
        const reqIndex = this.withdrawalRequests.findIndex(r => r.id === requestId);
        if (reqIndex !== -1 && this.withdrawalRequests[reqIndex].status === 'pending') {
            const req = this.withdrawalRequests[reqIndex];
            const user = this.users.find(u => u.id === req.userId);
            if (user) {
                user.withdrawalBalance += req.grossUsdtValue;
                user.totalWithdrawals -= req.usdtValue;
                this.addTransaction({ userId: user.id, account: 'withdrawal', type: 'withdrawal_refund', description: 'tx_withdrawal_refund', amount: req.grossUsdtValue });
            }
            this.withdrawalRequests[reqIndex].status = 'rejected';
            return true;
        }
        return false;
    }


    getVipLevels(userId?: number): VipLevel[] {
        const levels: VipLevel[] = JSON.parse(JSON.stringify(this.vipLevelsData));
        const user = userId ? this.findUserById(userId) : null;

        if (user) {
            const userLevelIndex = levels.findIndex(level => level.name === user.vipLevel);
            
            return levels.map((level, index) => {
                let status: 'active' | 'locked' | 'owned';
                if (index < userLevelIndex) {
                    status = 'owned';
                } else if (index === userLevelIndex) {
                    status = 'active';
                } else {
                    status = 'locked';
                }
                return {
                    ...level,
                    status,
                };
            });
        }

        return levels.map(level => ({...level, status: 'locked'}));
    }
    
    addVipLevel(levelData: Partial<VipLevel>) {
        const existingIds = this.vipLevelsData
            .map(l => parseInt(l.id.replace('nadec', ''), 10))
            .filter(n => !isNaN(n));
        const newIdNumber = (existingIds.length > 0 ? Math.max(...existingIds) : 0) + 1;
        const newId = `nadec${newIdNumber}`;

        const newLevel: VipLevel = {
            id: newId,
            name: levelData.name || `Nadec${newIdNumber}`,
            imageSrc: levelData.imageSrc || 'https://images.unsplash.com/photo-1612187192690-f21d3f671198?w=300', // A default image
            tasks: levelData.tasks || 1,
            benefit: levelData.benefit || 0,
            dailyProfit: levelData.dailyProfit || 0,
            totalProfit: levelData.totalProfit || 0,
            status: 'locked',
            unlockCost: levelData.unlockCost || 0,
        };
        this.vipLevelsData.push(newLevel);
        return newLevel;
    }

    upgradeVipLevel(userId: number, newVipId: string): { success: boolean; message: string; requiredAmount?: number } {
        const user = this.users.find(u => u.id === userId);
        const newVip = this.vipLevelsData.find(v => v.id === newVipId);

        if (!user || !newVip) {
            return { success: false, message: 'errorUserOrVipNotFound' };
        }
        
        const unlockCost = newVip.unlockCost || 0;

        if (user.mainBalance < unlockCost) {
            return { success: false, message: 'insufficient_balance', requiredAmount: unlockCost };
        }

        user.mainBalance -= unlockCost;
        user.vipLevel = newVip.name;
        user.taskNextAvailableAt = Date.now();
        this.addTransaction({ userId: user.id, account: 'main', type: 'vip_purchase', description: 'tx_vip_purchase', amount: -unlockCost });
        
        return { success: true, message: 'Upgrade successful' };
    }
    
    adminUpgradeVipLevel(userId: number, newVipId: string): { success: boolean; message: string; } {
        const user = this.users.find(u => u.id === userId);
        const newVip = this.vipLevelsData.find(v => v.id === newVipId);

        if (!user || !newVip) {
            return { success: false, message: 'errorUserOrVipNotFound' };
        }

        user.vipLevel = newVip.name;
        user.taskNextAvailableAt = Date.now();
        
        return { success: true, message: 'Admin upgrade successful' };
    }

    completeTask(userId: number): { success: boolean, message?: string } {
        const user = this.findUserById(userId);
        if (!user) return { success: false, message: 'errorUserNotFound' };
        
        const isTaskAvailable = !user.taskNextAvailableAt || Date.now() >= user.taskNextAvailableAt;
        if (!isTaskAvailable) return { success: false, message: 'errorTaskAlreadyCompleted' };

        const userVipLevel = this.vipLevelsData.find(v => v.name === user.vipLevel);
        if (!userVipLevel) return { success: false, message: 'errorNoActiveTask' };

        const income = userVipLevel.benefit;
        
        this.updateUser(userId, {
            withdrawalBalance: user.withdrawalBalance + income,
            taskCommission: user.taskCommission + income,
            taskNextAvailableAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        
        this.addTransaction({
            userId: userId,
            account: 'withdrawal',
            type: 'task_income',
            description: 'tx_task_income',
            amount: income,
            metadata: {
                vipLevel: user.vipLevel
            }
        });
        
        return { success: true };
    }
    
    initializeCrawlTasks(userId: number, setIndex: number) {
        const user = this.findUserById(userId);
        if (!user || !user.crawlSets?.[setIndex]) return false;
    
        const crawlSet = user.crawlSets[setIndex];
        
        if (crawlSet.enabled && crawlSet.activeTaskIds.length === 0 && crawlSet.completedTasks.length === 0) {
            crawlSet.activeTaskIds = [customizableTaskIds[setIndex][0]]; // Add the free task for the set
            return true;
        }
        return false;
    }

    getCrawlTaskForUser(userId: number, taskId: string, setIndex: number): CrawlTask | undefined {
        const taskPool = this.crawlTaskPools[setIndex];
        if (!taskPool) return undefined;

        const baseTask = taskPool.find(t => t.id === taskId);
        if (!baseTask) return undefined;

        const user = this.findUserById(userId);
        if (!user) return baseTask; // Should not happen, but return base task if user not found

        // Start with a copy of the base task
        const effectiveTask: CrawlTask = { ...baseTask };

        // 1. Apply VIP Level Overrides first
        const vipOverrides = this.vipCrawlTaskSettings[user.vipLevel]?.[setIndex]?.[taskId];
        if (vipOverrides) {
            Object.assign(effectiveTask, vipOverrides);
        }

        // 2. Apply User-Specific Overrides (these have the highest priority)
        const userOverride = user.crawlSets?.[setIndex]?.taskOverrides?.[taskId];
        if (userOverride) {
            if (typeof userOverride.price === 'number' && isFinite(userOverride.price)) {
                effectiveTask.price = userOverride.price;
            }
            if (typeof userOverride.income === 'number' && isFinite(userOverride.income)) {
                effectiveTask.income = userOverride.income;
            }
        }

        return effectiveTask;
    }

    getNextCrawlTask(userId: number, setIndex: number): CrawlTask | null {
        const user = this.findUserById(userId);
        const taskPool = this.crawlTaskPools[setIndex];
        const orderedTaskIds = customizableTaskIds[setIndex];
        
        if (user && user.crawlSets?.[setIndex]?.enabled && taskPool && orderedTaskIds) {
            const crawlSet = user.crawlSets[setIndex];
            const usedTaskIds = new Set([...crawlSet.activeTaskIds, ...crawlSet.completedTasks.map(t => t.taskId)]);

            // Find the first task in the ordered list that is not used yet
            const nextTaskId = orderedTaskIds.find(id => !usedTaskIds.has(id));
            
            if (nextTaskId) {
                const nextTask = taskPool.find(t => t.id === nextTaskId);
                if (nextTask) {
                    crawlSet.activeTaskIds.push(nextTask.id);
                    return this.getCrawlTaskForUser(userId, nextTask.id, setIndex);
                }
            }
        }
        return null;
    }

    completeCrawlTask(userId: number, taskId: string, setIndex: number): { success: boolean; message?: string } {
        const user = this.findUserById(userId);
        const task = this.getCrawlTaskForUser(userId, taskId, setIndex);
        const crawlSet = user?.crawlSets?.[setIndex];

        if (!user || !task || !crawlSet) { return { success: false, message: 'errorTaskOrUserNotFound' }; }
        if (!crawlSet.activeTaskIds.includes(taskId)) { return { success: false, message: 'errorTaskNotActive' }; }
        
        const totalBalance = user.mainBalance + user.withdrawalBalance;
        if (totalBalance < task.price) { return { success: false, message: 'insufficientBalance' }; }

        let priceDeductedFromWithdrawal = 0;
        let priceDeductedFromMain = 0;
        
        if (user.withdrawalBalance >= task.price) {
            priceDeductedFromWithdrawal = task.price;
        } else {
            priceDeductedFromWithdrawal = user.withdrawalBalance;
            priceDeductedFromMain = task.price - priceDeductedFromWithdrawal;
        }

        user.withdrawalBalance -= priceDeductedFromWithdrawal;
        user.mainBalance -= priceDeductedFromMain;
        this.addTransaction({ userId, account: 'withdrawal', type: 'crawl_task_purchase', description: 'tx_crawl_task_purchase', amount: -task.price });

        const grossReturn = task.price + task.income;
        user.withdrawalBalance += grossReturn;
        
        this.addTransaction({
            userId,
            account: 'withdrawal',
            type: 'task_income',
            description: 'tx_task_income',
            amount: grossReturn,
            metadata: {
                vipLevel: task.name
            }
        });
        
        crawlSet.activeTaskIds = crawlSet.activeTaskIds.filter(id => id !== taskId);
        crawlSet.completedTasks.push({ taskId, timestamp: new Date().toISOString() });

        return { success: true };
    }

    approveRecharge(rechargeId: number) {
        const reqIndex = this.pendingRecharges.findIndex(r => r.id === rechargeId);
        if (reqIndex === -1) {
            return false;
        }

        const req = this.pendingRecharges[reqIndex];
        const rechargedUser = this.users.find(u => u.id === req.userId);

        if (rechargedUser) {
            rechargedUser.mainBalance += req.amount;
            rechargedUser.rechargeAmount += req.amount;
            this.addTransaction({ userId: rechargedUser.id, account: 'main', type: 'recharge', description: 'tx_recharge', amount: req.amount });


            const processCommission = (user: User, level: number, originalReferrer: User) => {
                if (!user.invitedBy || level > 3) {
                    return;
                }

                const referrer = this.findUserByInvitationCode(user.invitedBy);
                if (!referrer) {
                    return;
                }
                
                const effectiveCommissionRates = originalReferrer.commissionRatesOverride || this.platformSettings.commissionRates;
                const commissionRate = effectiveCommissionRates[level];

                if (commissionRate) {
                    const commissionAmount = req.amount * (commissionRate / 100);
                    referrer.withdrawalBalance += commissionAmount;
                    referrer.rechargeCommission += commissionAmount;
                    this.addTransaction({ userId: referrer.id, account: 'withdrawal', type: 'referral_commission', description: 'tx_referral_commission', amount: commissionAmount });
                }

                processCommission(referrer, level + 1, originalReferrer);
            };

            processCommission(rechargedUser, 1, rechargedUser);
        }

        this.pendingRecharges.splice(reqIndex, 1);
        return true;
    }

    rejectRecharge(rechargeId: number) {
        const reqIndex = this.pendingRecharges.findIndex(r => r.id === rechargeId);
        if (reqIndex !== -1) {
            this.pendingRecharges.splice(reqIndex, 1);
            return true;
        }
        return false;
    }
    
    getReferrals(invitationCode: string) {
        const level1 = this.users.filter(u => u.invitedBy === invitationCode);
        const level1Codes = level1.map(u => u.invitationCode);
        const level2 = this.users.filter(u => u.invitedBy && level1Codes.includes(u.invitedBy));
        const level2Codes = level2.map(u => u.invitationCode);
        const level3 = this.users.filter(u => u.invitedBy && level2Codes.includes(u.invitedBy));
        return { level1, level2, level3 };
    }

    claimLoginReward(userId: number): { success: boolean; message: string } {
        const user = this.findUserById(userId);
        if (!user) {
            return { success: false, message: 'errorUserNotFound' };
        }
    
        const today = new Date().toISOString().split('T')[0];
        if (user.lastLoginDate === today) {
            return { success: false, message: 'reward_already_claimed' };
        }
    
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = 1;
        if (user.lastLoginDate === yesterdayStr) {
            newStreak = user.loginStreak + 1;
        }
    
        const reward = this.platformSettings.loginRewards.find(r => r.day === newStreak);
        
        if (reward) {
            user.withdrawalBalance += reward.amount;
            this.addTransaction({
                userId,
                account: 'withdrawal',
                type: 'login_reward',
                description: 'tx_login_reward',
                amount: reward.amount,
            });
        }
    
        user.loginStreak = newStreak;
        user.lastLoginDate = today;
    
        return { success: true, message: 'Reward claimed' };
    }
    
    // Activity CRUD
    getActivities(): Activity[] {
        return this.activitiesData;
    }

    addActivity(activityData: Omit<Activity, 'id'>): Activity {
        const newActivity: Activity = {
            id: Date.now().toString(),
            ...activityData
        };
        this.activitiesData.push(newActivity);
        return newActivity;
    }

    updateActivity(activityId: string, updates: Partial<Activity>): Activity | undefined {
        const index = this.activitiesData.findIndex(a => a.id === activityId);
        if (index !== -1) {
            this.activitiesData[index] = { ...this.activitiesData[index], ...updates };
            return this.activitiesData[index];
        }
        return undefined;
    }

    deleteActivity(activityId: string): boolean {
        const initialLength = this.activitiesData.length;
        this.activitiesData = this.activitiesData.filter(a => a.id !== activityId);
        return this.activitiesData.length < initialLength;
    }
    
    // Submission Methods
    addActivitySubmission(submissionData: Omit<ActivitySubmission, 'id' | 'submissionDate' | 'status'>): ActivitySubmission {
        const newSubmission: ActivitySubmission = {
            ...submissionData,
            id: this.nextSubmissionId++,
            submissionDate: new Date().toISOString(),
            status: 'pending'
        };
        this.activitySubmissions.unshift(newSubmission);
        return newSubmission;
    }
    
    approveSubmission(submissionId: number): boolean {
        const submission = this.activitySubmissions.find(s => s.id === submissionId);
        if (submission && submission.status === 'pending') {
            const user = this.findUserById(submission.userId);
            const activity = this.activitiesData.find(a => a.id === submission.activityId);
            if (user && activity) {
                user.withdrawalBalance += activity.amount;
                this.addTransaction({
                    userId: user.id,
                    account: 'withdrawal',
                    type: 'system_bonus',
                    description: 'tx_system_bonus', // Using a generic key
                    amount: activity.amount,
                    metadata: {
                        vipLevel: activity.title // using vipLevel metadata to store activity title
                    }
                });
            }
            submission.status = 'approved';
            return true;
        }
        return false;
    }
    
    rejectSubmission(submissionId: number): boolean {
        const submission = this.activitySubmissions.find(s => s.id === submissionId);
        if (submission && submission.status === 'pending') {
            submission.status = 'rejected';
            return true;
        }
        return false;
    }
}

export const db = new MockDatabase();