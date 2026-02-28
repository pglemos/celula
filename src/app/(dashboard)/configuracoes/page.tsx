import { getTenantSettings } from "@/lib/actions/settings";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsPage() {
    const tenant = await getTenantSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie as preferências e dados do sistema Central 3.0
                </p>
            </div>

            <SettingsTabs tenant={tenant} />
        </div>
    );
}
