const Wappalyzer = require('wappalyzer');
const { load } = require('cheerio');
const normalizeUrl = require('normalize-url');
const debug = require('debug')('domain-scraper:server');

// Social media platforms
const socialNetworksObject = {
  socialNetworks: [
    'facebook',
    'twitter',
    'linkedin',
    'pinterest',
    'tumblr',
    'soundcloud',
    'instagram',
    'youtube',
    'snapchat',
  ],
};

// Youtube regex
const CUSTOM_REGEX = {
  youtube: '(channel/([\\w|@|-]+?)(?:/videos)?/?$|user?/([\\w|@|-]+)/?$)',
};

// Social media handle from url
const getHandleFromURL = (url, customRegex = null) => {
  try {
    const path = new URL(url).pathname;
    const regex = customRegex
      ? new RegExp(customRegex, 'i')
      : new RegExp('/([\\w|@|-]+)/?$', 'i');
    const match = regex.exec(path);
    return customRegex
      ? match.find((match, index) => index > 1 && match !== undefined)
      : match[1];
  } catch (error) {
    // Unable to parse handle, return empty value
    return '';
  }
};

// Social media parse html
const parseSocialMedia = (base) => ($) => {
  const handles = [];
  $(`a[href*="${base}."]`).each((index, elem) => {
    const url = elem.attribs.href;
    const handle = url ? getHandleFromURL(url, CUSTOM_REGEX[base] || '') : '';
    handles.push(handle);
  });
  return handles.filter(
    (handle, index) => index === handles.indexOf(handle) && handle,
  );
};

function getSocialMedia(html, url) {
  try {
    const $ = load(html);
    const handles = {};
    socialNetworksObject.socialNetworks.forEach((socialNetwork) => {
      handles[socialNetwork] = parseSocialMedia(socialNetwork)($);
    });
    return handles;
  } catch (error) {
    debug(`error getting social media links from ${url} error was ${error}`);
    return null;
  }
}

// Organized the raw data into an easy to store object
function decodeJson(applicationData, domainName, statusCode, socialMedia) {
  try {
    const AccountingArray = [];
    const AdvertisingNetworksArray = [];
    const AnalyticsArray = [];
    const BlogsArray = [];
    const BuildCIArray = [];
    const CacheToolsArray = [];
    const CaptchasArray = [];
    const CDNArray = [];
    const CMSArray = [];
    const CommentSystemsArray = [];
    const ContainersArray = [];
    const ControlSystemsArray = [];
    const CRMArray = [];
    const CryptominerArray = [];
    const DatabaseManagersArray = [];
    const DatabasesArray = [];
    const DevToolsArray = [];
    const DocumentManagementSystemsArray = [];
    const DocumentationToolsArray = [];
    const EcommerceArray = [];
    const EditorsArray = [];
    const FeedReadersArray = [];
    const FontScriptsArray = [];
    const HostingPanelsArray = [];
    const IaaSArray = [];
    const IssueTrackersArray = [];
    const JavaScriptFrameworksArray = [];
    const JavaScriptGraphicsArray = [];
    const JavaScriptLibrariesArray = [];
    const LandingPageBuildersArray = [];
    const LiveChatArray = [];
    const LMSArray = [];
    const LoadBalancerArray = [];
    const MapsArray = [];
    const MarketingAutomationArray = [];
    const MediaServersArray = [];
    const MessageBoardsArray = [];
    const MiscellaneousArray = [];
    const MobileFrameworksArray = [];
    const NetworkDevicesArray = [];
    const NetworkStorageArray = [];
    const OperatingSystemsArray = [];
    const PaaSArray = [];
    const PaymentProcessorsArray = [];
    const PaywallsArray = [];
    const PhotoGalleriesArray = [];
    const PrintersArray = [];
    const ProgrammingLanguagesArray = [];
    const RemoteAccessArray = [];
    const ReverseProxyArray = [];
    const RichTextEditorsArray = [];
    const SaaSArray = [];
    const SearchEnginesArray = [];
    const SEOArray = [];
    const StaticSiteGeneratorArray = [];
    const TagManagersArray = [];
    const UserOnboardingArray = [];
    const VideoPlayersArray = [];
    const WebFrameworksArray = [];
    const WebMailArray = [];
    const WebServerExtensionsArray = [];
    const WebServersArray = [];
    const WebcamsArray = [];
    const WidgetsArray = [];
    const WikisArray = [];

    if (applicationData.length > 0) {
      for (let y = 0; y < applicationData.length; y += 1) {
        const applicationName = applicationData[y].name;
        const applicationConfidence = applicationData[y].confidence;
        const applicationCaregories = applicationData[y].categories;
        if (applicationConfidence >= 0) {
          if (applicationCaregories) {
            for (const key in applicationCaregories) {
              const applicationCategoryName = applicationCaregories[key][Object.keys(applicationCaregories[key])[0]];
              switch (applicationCategoryName) {
                case 'Accounting':
                  AccountingArray.push(applicationName);
                  break;
                case 'Advertising Networks':
                  AdvertisingNetworksArray.push(applicationName);
                  break;
                case 'Analytics':
                  AnalyticsArray.push(applicationName);
                  break;
                case 'Blogs':
                  BlogsArray.push(applicationName);
                  break;
                case 'Build CI':
                  BuildCIArray.push(applicationName);
                  break;
                case 'Cache Tools':
                  CacheToolsArray.push(applicationName);
                  break;
                case 'Captchas':
                  CaptchasArray.push(applicationName);
                  break;
                case 'CDN':
                  CDNArray.push(applicationName);
                  break;
                case 'CMS':
                  CMSArray.push(applicationName);
                  break;
                case 'Comment Systems':
                  CommentSystemsArray.push(applicationName);
                  break;
                case 'Containers':
                  ContainersArray.push(applicationName);
                  break;
                case 'Control Systems':
                  ControlSystemsArray.push(applicationName);
                  break;
                case 'CRM':
                  CRMArray.push(applicationName);
                  break;
                case 'Cryptominer':
                  CryptominerArray.push(applicationName);
                  break;
                case 'Database Managers':
                  DatabaseManagersArray.push(applicationName);
                  break;
                case 'Databases':
                  DatabasesArray.push(applicationName);
                  break;
                case 'Dev Tools':
                  DevToolsArray.push(applicationName);
                  break;
                case 'Document Management Systems':
                  DocumentManagementSystemsArray.push(applicationName);
                  break;
                case 'Documentation Tools':
                  DocumentationToolsArray.push(applicationName);
                  break;
                case 'Ecommerce':
                  EcommerceArray.push(applicationName);
                  break;
                case 'Editors':
                  EditorsArray.push(applicationName);
                  break;
                case 'Feed Readers':
                  FeedReadersArray.push(applicationName);
                  break;
                case 'Font Scripts':
                  FontScriptsArray.push(applicationName);
                  break;
                case 'Hosting Panels':
                  HostingPanelsArray.push(applicationName);
                  break;
                case 'IaaS':
                  IaaSArray.push(applicationName);
                  break;
                case 'Issue Trackers':
                  IssueTrackersArray.push(applicationName);
                  break;
                case 'JavaScript Frameworks':
                  JavaScriptFrameworksArray.push(applicationName);
                  break;
                case 'JavaScript Graphics':
                  JavaScriptGraphicsArray.push(applicationName);
                  break;
                case 'JavaScript Libraries':
                  JavaScriptLibrariesArray.push(applicationName);
                  break;
                case 'Landing Page Builders':
                  LandingPageBuildersArray.push(applicationName);
                  break;
                case 'Live Chat':
                  LiveChatArray.push(applicationName);
                  break;
                case 'LMS':
                  LMSArray.push(applicationName);
                  break;
                case 'Load Balancer':
                  LoadBalancerArray.push(applicationName);
                  break;
                case 'Maps':
                  MapsArray.push(applicationName);
                  break;
                case 'Marketing Automation':
                  MarketingAutomationArray.push(applicationName);
                  break;
                case 'Media Servers':
                  MediaServersArray.push(applicationName);
                  break;
                case 'Message Boards':
                  MessageBoardsArray.push(applicationName);
                  break;
                case 'Miscellaneous':
                  MiscellaneousArray.push(applicationName);
                  break;
                case 'Mobile Frameworks':
                  MobileFrameworksArray.push(applicationName);
                  break;
                case 'Network Devices':
                  NetworkDevicesArray.push(applicationName);
                  break;
                case 'Network Storage':
                  NetworkStorageArray.push(applicationName);
                  break;
                case 'Operating Systems':
                  OperatingSystemsArray.push(applicationName);
                  break;
                case 'PaaS':
                  PaaSArray.push(applicationName);
                  break;
                case 'Payment Processors':
                  PaymentProcessorsArray.push(applicationName);
                  break;
                case 'Paywalls':
                  PaywallsArray.push(applicationName);
                  break;
                case 'Photo Galleries':
                  PhotoGalleriesArray.push(applicationName);
                  break;
                case 'Printers':
                  PrintersArray.push(applicationName);
                  break;
                case 'Programming Languages':
                  ProgrammingLanguagesArray.push(applicationName);
                  break;
                case 'Remote Access':
                  RemoteAccessArray.push(applicationName);
                  break;
                case 'Reverse Proxy':
                  ReverseProxyArray.push(applicationName);
                  break;
                case 'Rich Text Editors':
                  RichTextEditorsArray.push(applicationName);
                  break;
                case 'SaaS':
                  SaaSArray.push(applicationName);
                  break;
                case 'Search Engines':
                  SearchEnginesArray.push(applicationName);
                  break;
                case 'SEO':
                  SEOArray.push(applicationName);
                  break;
                case 'Static Site Generator':
                  StaticSiteGeneratorArray.push(applicationName);
                  break;
                case 'Tag Managers':
                  TagManagersArray.push(applicationName);
                  break;
                case 'User Onboarding':
                  UserOnboardingArray.push(applicationName);
                  break;
                case 'Video Players':
                  VideoPlayersArray.push(applicationName);
                  break;
                case 'Web Frameworks':
                  WebFrameworksArray.push(applicationName);
                  break;
                case 'Web Mail':
                  WebMailArray.push(applicationName);
                  break;
                case 'Web Server Extensions':
                  WebServerExtensionsArray.push(applicationName);
                  break;
                case 'Web Servers':
                  WebServersArray.push(applicationName);
                  break;
                case 'Webcams':
                  WebcamsArray.push(applicationName);
                  break;
                case 'Widgets':
                  WidgetsArray.push(applicationName);
                  break;
                case 'Wikis Array':
                  WikisArray.push(applicationName);
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    }

    const FinalArray = {
      domain: domainName.replace('http://', ''),
      status_code: statusCode,
      data: {
        accounting: AccountingArray,
        advertising_newtworks: AdvertisingNetworksArray,
        analytics: AnalyticsArray,
        blogs: BlogsArray,
        build_ci: BuildCIArray,
        cache_tools: CacheToolsArray,
        captchas: CaptchasArray,
        cdn: CDNArray,
        cms: CMSArray,
        comments_systems: CommentSystemsArray,
        containers: ContainersArray,
        control_systems: ControlSystemsArray,
        crm: CRMArray,
        cryptominer: CryptominerArray,
        database_manager: DatabaseManagersArray,
        database: DatabasesArray,
        devtools: DevToolsArray,
        document_mangment_systems: DocumentManagementSystemsArray,
        documentation_tools: DocumentationToolsArray,
        ecommerce: EcommerceArray,
        editors: EditorsArray,
        feed_readers: FeedReadersArray,
        font_script: FontScriptsArray,
        hosting_panels: HostingPanelsArray,
        iaas: IaaSArray,
        issue_trackers: IssueTrackersArray,
        javascript_frameworks: JavaScriptFrameworksArray,
        javascript_graphics: JavaScriptGraphicsArray,
        javascript_libraries: JavaScriptLibrariesArray,
        landingpage_builders: LandingPageBuildersArray,
        livechat: LiveChatArray,
        lms: LMSArray,
        load_balancers: LoadBalancerArray,
        maps: MapsArray,
        marketing_automation: MarketingAutomationArray,
        media_servers: MediaServersArray,
        message_boards: MessageBoardsArray,
        miscellaneous: MiscellaneousArray,
        mobile_frameworks: MobileFrameworksArray,
        network_devices: NetworkDevicesArray,
        network_storage: NetworkStorageArray,
        operating_systems: OperatingSystemsArray,
        paas: PaaSArray,
        payment_processors: PaymentProcessorsArray,
        paywalls: PaywallsArray,
        photo_galleries: PhotoGalleriesArray,
        printers: PrintersArray,
        programming_languages: ProgrammingLanguagesArray,
        remote_access: RemoteAccessArray,
        reverse_proxy: ReverseProxyArray,
        rich_text_editors: RichTextEditorsArray,
        saas: SaaSArray,
        search_engines: SearchEnginesArray,
        seo: SEOArray,
        static_site_generator: StaticSiteGeneratorArray,
        tag_manager: TagManagersArray,
        user_onboarding: UserOnboardingArray,
        video_players: VideoPlayersArray,
        web_frameworks: WebFrameworksArray,
        web_mail: WebMailArray,
        web_server_extentions: WebServerExtensionsArray,
        web_servers: WebServersArray,
        webcam: WebcamsArray,
        widgets: WidgetsArray,
        wikis: WikisArray,
      },
      social_Media: socialMedia,
    };

    return FinalArray;
  } catch (error) {
    debug(error);
    return {};
  }
}

// Single URL search params
const wappalyserOptions = {
  debug: false,
  delay: 1000,
  maxDepth: 3,
  maxUrls: 5,
  maxWait: 15000,
  recursive: true,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  htmlMaxCols: 2000,
  htmlMaxRows: 3000,
};

/*
    Exposed functions
*/
module.exports = {
  runWappalyzer(url, res) {
    url = normalizeUrl(url); // Add a protocol to the url

    const wappalyzer = new Wappalyzer(url, wappalyserOptions);

    // Optional: scrape for social media links ( TO DO: ai for vertical cassification?)
    wappalyzer.on('visit', (params) => {
      try {
        const {
          browser,
        } = params;
        const socialMedia = getSocialMedia(browser.html, url);
        return socialMedia;
      } catch (error) {
        debug(`error getting social stuff from ${url} error was ${error}`);
        return null;
      }
    });

    // Analyze the results then return formatted JSON as return.  Return 500 if error.
    wappalyzer.analyze()
      .then((data) => {
        if (data == null) {
          res.status(500).send('internal server error');
        }
        const domainName = Object.keys(data.urls)[0];
        const statusCode = data.urls[domainName].status;
        switch (statusCode) {
          case 200:
            res.status(200).send(decodeJson(data.applications, url, statusCode, socialMedia));
            break;
          case 0:
            res.status(422).send('domain can not be crawled');
            break;
          default:
            res.status(500).send('internal server error');
            break;
        }
      })
      .catch((error) => {
        debug(error);
        res.status(422).send('did you input a valid domain?');
      });
  },
};
