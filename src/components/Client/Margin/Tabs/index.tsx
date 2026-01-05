interface TabItem<T extends string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
}

const TabsComponent = <T extends string>({
  tabs,
  activeKey,
  onChange,
}: TabsProps<T>) => {
  return (
    <div className="trade-tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${activeKey === t.key ? "active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}   
    </div>
  );
};

export default TabsComponent;
