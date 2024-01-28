'use client';

import { useTheme } from 'next-themes';
import cn from '@/utils/class-names';
import { Button } from '@/component/ui/button';
import SimpleBar from '@/component/ui/simplebar';
import { useColorPresetName } from '@/hooks/use-theme-color';
import EnvatoIcon from '@/component/icons/envato';
import LayoutSwitcher from '@/component/settings/layout-switcher';
import ColorOptions from '@/component/settings/color-options';
import AppDirection from '@/component/settings/app-direction';
import ThemeSwitcher from '@/component/settings/theme-switcher';

export default function SettingsDrawer() {
  const { theme } = useTheme();
  const { colorPresetName } = useColorPresetName();

  return (
    <>
      <SimpleBar className="h-[calc(100%-138px)]">
        <div className="px-5 py-6">
          <ThemeSwitcher />
          <AppDirection />
          <LayoutSwitcher />
          <ColorOptions />
        </div>
      </SimpleBar>
    </>
  );
}
