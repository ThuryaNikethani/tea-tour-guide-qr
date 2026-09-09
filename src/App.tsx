import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import data from "./data.json";
import logo from "./assets/logo.png";

type LanguageCode = "en" | "si" | "ta" | "ru" | "ar" | "it" | "de" | "zh" | "ja" | "es" | "fr";

const languages = data.languages as Array<{
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flag: string;
  dir?: "rtl";
}>;
const stationsData = data.stations as Array<{
  id: string;
  order: number;
  verified: boolean;
  names: Record<LanguageCode, string>;
}>;

// The site the QR codes should point at. Set VITE_MAIN_SITE_URL in Netlify's
// site environment variables — this project has no station pages of its own,
// it only prints codes that link out to the main tour app.
const MAIN_SITE_URL = (import.meta.env.VITE_MAIN_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

const ui = data.ui as Record<LanguageCode, Record<string, string>>;
const villa = data.villa as Record<LanguageCode, { name: string; tagline: string }>;

function t(lang: LanguageCode, key: string): string {
  return ui[lang]?.[key] ?? ui.en[key] ?? key;
}

export function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const printedOn = new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date());
  const stations = stationsData;
  const villaText = villa[language] ?? villa.en;
  const missingBaseUrl = !MAIN_SITE_URL;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 print:max-w-none print:px-6 print:py-6">
      {missingBaseUrl && (
        <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 text-red-800 text-sm rounded-md print:hidden">
          <strong>Configuration needed:</strong> set the <code>VITE_MAIN_SITE_URL</code> environment variable
          (e.g. <code>https://athukorala-tea-tour.netlify.app</code>) in this site's Netlify settings, then
          redeploy — otherwise the QR codes below have nowhere to point.
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
        <div className="min-w-0">
          <h1 className="font-semibold text-2xl text-tea-900 truncate">{t(language, "qrSheetTitle")}</h1>
          <p className="text-tea-600 text-sm truncate">{t(language, "qrSheetSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="border border-tea-300 rounded-lg px-3 py-2 text-sm"
            aria-label={t(language, "changeLanguage")}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-tea-700 hover:bg-tea-800 text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            {t(language, "printButton")}
          </button>
        </div>
      </div>

      <div className="hidden print:flex items-center gap-3 border-b-2 border-tea-900 pb-4 mb-6">
        <img src={logo} alt="" className="w-10 h-10 rounded-full object-contain" />
        <div>
          <p className="font-semibold text-lg text-tea-900 leading-tight">{t(language, "appTitle")}</p>
          <p className="text-tea-500 text-xs">
            {t(language, "qrSheetTitle")} · {printedOn}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-x-6 print:gap-y-8">
        {stations.map((station) => {
          const name = station.names[language] ?? station.names.en;
          const url = `${MAIN_SITE_URL}/station/${station.id}`;
          return (
            <div
              key={station.id}
              className="relative flex flex-col items-center gap-3 bg-white border-2 border-dashed border-tea-300 rounded-md p-6 print:break-inside-avoid print:border-tea-400"
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-tea-700 text-white font-semibold text-xs shrink-0">
                  {station.order}
                </span>
                <span className="text-tea-500 text-xs font-medium uppercase tracking-wide">
                  {t(language, "stationOf").replace("{current}", String(station.order)).replace("{total}", String(stations.length))}
                </span>
                {!station.verified && (
                  <span className="text-[10px] uppercase tracking-wide text-brass-600 bg-brass-300/15 border border-brass-300/50 rounded-full px-2 py-0.5">
                    {t(language, "draftLabel")}
                  </span>
                )}
              </div>

              <h2 className="font-semibold text-xl text-tea-900 text-center">{name}</h2>

              <div className="p-3 bg-white rounded-xl border border-tea-100 shadow-sm">
                <QRCodeSVG
                  value={url}
                  size={170}
                  level="H"
                  fgColor="#1a2e17"
                  imageSettings={{ src: logo, height: 32, width: 32, excavate: true }}
                />
              </div>

              <p className="text-tea-600 text-xs font-medium">{t(language, "scanQrHint")}</p>
              <p className="text-tea-400 text-[11px] break-all text-center font-mono">{url}</p>

              <div className="w-full flex items-center gap-2 pt-3 mt-1 border-t border-tea-100">
                <img src={logo} alt="" className="w-5 h-5 rounded-full object-contain opacity-80" />
                <span className="text-tea-400 text-[11px]">{t(language, "appTitle")}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-8 border-t-2 border-tea-200 print:break-before-page">
        <div className="grid sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-x-6 print:gap-y-8">
          <div className="relative flex flex-col items-center gap-3 bg-white border-2 border-dashed border-gold-400 rounded-md p-6 print:break-inside-avoid print:border-gold-500">
            <h2 className="font-semibold text-xl text-tea-900 text-center">{t(language, "appTitle")}</h2>
            <p className="text-tea-500 text-xs text-center">{t(language, "tagline")}</p>
            <div className="p-3 bg-white rounded-xl border border-tea-100 shadow-sm">
              <QRCodeSVG
                value={`${MAIN_SITE_URL}/`}
                size={170}
                level="H"
                fgColor="#1a2e17"
                imageSettings={{ src: logo, height: 32, width: 32, excavate: true }}
              />
            </div>
            <p className="text-tea-600 text-xs font-medium">{t(language, "scanQrHint")}</p>
            <p className="text-tea-400 text-[11px] break-all text-center font-mono">{`${MAIN_SITE_URL}/`}</p>
          </div>

          <div className="relative flex flex-col items-center gap-3 bg-white border-2 border-dashed border-gold-400 rounded-md p-6 print:break-inside-avoid print:border-gold-500">
            <h2 className="font-semibold text-xl text-tea-900 text-center">{villaText.name}</h2>
            <p className="text-tea-500 text-xs text-center">{villaText.tagline}</p>
            <div className="p-3 bg-white rounded-xl border border-tea-100 shadow-sm">
              <QRCodeSVG
                value={`${MAIN_SITE_URL}/villa`}
                size={170}
                level="H"
                fgColor="#1a2e17"
                imageSettings={{ src: logo, height: 32, width: 32, excavate: true }}
              />
            </div>
            <p className="text-tea-600 text-xs font-medium">{t(language, "scanQrHint")}</p>
            <p className="text-tea-400 text-[11px] break-all text-center font-mono">{`${MAIN_SITE_URL}/villa`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
