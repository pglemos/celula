import { getTenantSettings } from "@/lib/actions/settings";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsPage() {
    const tenant = await getTenantSettings();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Configurações</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gerencie as preferências e dados do sistema Central 3.0
                    </p>
                </div>
            </div>

            <SettingsTabs tenant={tenant} />
        </div>
    );
}
