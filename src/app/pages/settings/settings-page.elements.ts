import { GenericPageHtmlElements } from '../../components/generic-page.elements.js';

export class SettingsPageHtmlElements extends GenericPageHtmlElements {
  public Settings_alert_unsaved: HTMLDivElement = this.getElementById(
    'Settings_alert_unsaved',
  );

  public Setting_SourceImg_OuterBorder: HTMLInputElement = this.getElementById(
    'Setting_SourceImg_OuterBorder',
  );
  public Setting_SourceImg_TileBorder: HTMLInputElement = this.getElementById(
    'Setting_SourceImg_TileBorder',
  );

  public Setting_TileSets_Source: HTMLSelectElement = this.getElementById(
    'Setting_TileSets_Source',
  );
  public Setting_TileSets_Output: HTMLSelectElement = this.getElementById(
    'Setting_TileSets_Output',
  );

  public Setting_Render_TileID: HTMLInputElement = this.getElementById(
    'Setting_Render_TileID',
  );
  public Setting_Render_Background: HTMLInputElement = this.getElementById(
    'Setting_Render_Background',
  );
  public Setting_Render_BackgroundAlpha: HTMLInputElement = this.getElementById(
    'Setting_Render_BackgroundAlpha',
  );
  public Setting_Render_OuterBorderSize: HTMLInputElement = this.getElementById(
    'Setting_Render_OuterBorderSize',
  );
  public Setting_Render_TileBorderSize: HTMLInputElement = this.getElementById(
    'Setting_Render_TileBorderSize',
  );

  public Setting_BitMask_FancyBorder: HTMLInputElement = this.getElementById(
    'Setting_BitMask_FancyBorder',
  );
  public Setting_BitMask_Colors_Preset: HTMLSelectElement = this.getElementById(
    'Setting_BitMask_Colors_Preset',
  );

  public Setting_BitMask_Background: HTMLInputElement = this.getElementById(
    'Setting_BitMask_Background',
  );
  public Setting_BitMask_BackgroundAlpha: HTMLInputElement =
    this.getElementById('Setting_BitMask_BackgroundAlpha');
  public Setting_BitMask_Color: HTMLInputElement = this.getElementById(
    'Setting_BitMask_Color',
  );
  public Setting_BitMask_ColorAlpha: HTMLInputElement = this.getElementById(
    'Setting_BitMask_ColorAlpha',
  );
  public Setting_BitMask_TileSize: HTMLDivElement = this.getElementById(
    'Setting_BitMask_TileSize',
  );
}
