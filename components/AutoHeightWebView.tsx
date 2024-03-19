import React, { ComponentProps, useCallback } from "react";
import { Linking } from "react-native";
import makeWebshell, {
  HandleHTMLDimensionsFeature,
  HandleLinkPressFeature,
  useAutoheight,
} from "@formidable-webview/webshell";
import type { LinkPressTarget } from "@formidable-webview/webshell";
import WebView from "react-native-webview";

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new HandleLinkPressFeature({ preventDefault: true })
);

export type WebshellProps = ComponentProps<typeof Webshell>;

export default function AutoHeightWebView(webshellProps: WebshellProps) {
  const { autoheightWebshellProps } = useAutoheight({
    webshellProps,
  });

  const onLinkPress = useCallback((target: LinkPressTarget) => {
    Linking.canOpenURL(target.uri) && Linking.openURL(target.uri);
  }, []);
  return <Webshell {...autoheightWebshellProps} onDOMLinkPress={onLinkPress} />;
}
