import React, { useEffect } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { Colors } from '../styles/Colors';
import { Ag, Text } from './Text';
import { View } from './View/View';

export interface ITabItem<T = string> {
  id: T;
  label: string;
}

interface ITabSwitchProps<T> extends ScrollViewProps {
  tabs: ITabItem<T>[];
  value: ITabItem<T> | null;
  onChange: (tab: ITabItem<T>) => void;
  tabStyles?: TouchableOpacityProps['style'];
  fullWidth?: boolean;
}

export const TabSwitch = <T extends string>(props: ITabSwitchProps<T>) => {
  // Effects

  useEffect(() => {
    if (!props.value && props.tabs?.length) {
      props.onChange(props.tabs[0]);
    }
  }, []);

  // Renders

  const renderTabItem = (tab: ITabItem<T>) => {
    const isActive = props.value?.id === tab.id;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => props.onChange(tab)}
        style={[styles.tab, props.fullWidth && styles.fullWidthTab, props.tabStyles, isActive && styles.activeTab]}
        key={tab.id}
      >
        <Text ag={Ag.Control1Reg} style={isActive && styles.activeTabText}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTabsList = () => {
    return <View style={styles.tabsContainer}>{props.tabs.map(tab => renderTabItem(tab))}</View>;
  };

  if (props.fullWidth) {
    return <View style={[styles.tabs, styles.fullWidthTabs, props.style]}>{renderTabsList()}</View>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} {...props} style={[styles.tabs, props.style]}>
      {renderTabsList()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabs: {
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 32,
    padding: 2,
    borderRadius: 9,
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    overflow: 'hidden',
  },
  fullWidthTabs: {
    justifyContent: 'space-between',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    borderRadius: 7,
  },
  fullWidthTab: {
    flex: 1,
    marginRight: 0,
  },
  activeTab: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: Colors.primary.default,
  },
  activeTabText: {
    color: Colors.white,
  },
});
