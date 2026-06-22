import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  CreditCard,
  History,
  BookOpen,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Trash2,
  Edit2,
  Save,
  AlertCircle,
  Banknote,
  Smartphone,
} from "lucide-react";




type TableStatus = "livre" | "ocupada" | "reservada";
type PaymentMethod = "dinheiro" | "credito" | "debito" | "pix";
type OrderStatus = "aberta" | "paga" | "cancelada";

interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  available: boolean;
}

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  openedAt: Date;
  closedAt?: Date;
  customerCount: number;
  amountPaid?: number;
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  customerCount?: number;
}

const INITIAL_MENU: MenuItem[] = [
  { id: "m1", category: "Lanches", name: "X-Burguer", price: 18.9, available: true },
  { id: "m2", category: "Lanches", name: "X-Frango", price: 17.5, available: true },
  { id: "m3", category: "Lanches", name: "X-Salada", price: 20.0, available: true },
  { id: "m4", category: "Lanches", name: "X-Bacon Duplo", price: 24.9, available: true },
  { id: "m5", category: "Lanches", name: "Cachorro-Quente", price: 12.0, available: true },
  { id: "m6", category: "Porções", name: "Batata Frita P", price: 14.0, available: true },
  { id: "m7", category: "Porções", name: "Batata Frita G", price: 22.0, available: true },
  { id: "m8", category: "Porções", name: "Onion Rings", price: 18.0, available: true },
  { id: "m9", category: "Porções", name: "Nuggets (10un)", price: 16.0, available: true },
  { id: "m10", category: "Bebidas", name: "Refrigerante Lata", price: 6.0, available: true },
  { id: "m11", category: "Bebidas", name: "Suco Natural", price: 9.0, available: true },
  { id: "m12", category: "Bebidas", name: "Água Mineral", price: 4.0, available: true },
  { id: "m13", category: "Bebidas", name: "Milk-shake", price: 16.0, available: true },
  { id: "m14", category: "Bebidas", name: "Cerveja 600ml", price: 14.0, available: true },
  { id: "m15", category: "Sobremesas", name: "Pudim", price: 10.0, available: true },
  { id: "m16", category: "Sobremesas", name: "Sorvete 2 bolas", price: 12.0, available: true },
  { id: "m17", category: "Sobremesas", name: "Brownie", price: 11.0, available: true },
  { id: "m18", category: "Combos", name: "Combo Família (4 X-Burguer + 2 Batatas G)", price: 89.0, available: true },
];

const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  number: i + 1,
  capacity: i < 4 ? 2 : i < 10 ? 4 : 6,
  status: "livre" as TableStatus,
}));

const DEMO_ORDERS: Order[] = [
  {
    id: "o-demo-1",
    tableId: "t3",
    tableNumber: 3,
    items: [
      { menuItemId: "m1", name: "X-Burguer", price: 18.9, quantity: 2, notes: "" },
      { menuItemId: "m10", name: "Refrigerante Lata", price: 6.0, quantity: 2, notes: "" },
    ],
    status: "paga",
    paymentMethod: "pix",
    openedAt: new Date(Date.now() - 3600000 * 2),
    closedAt: new Date(Date.now() - 3600000 * 1.5),
    customerCount: 2,
    amountPaid: 49.8,
  },
  {
    id: "o-demo-2",
    tableId: "t7",
    tableNumber: 7,
    items: [
      { menuItemId: "m3", name: "X-Salada", price: 20.0, quantity: 3, notes: "" },
      { menuItemId: "m7", name: "Batata Frita G", price: 22.0, quantity: 1, notes: "" },
      { menuItemId: "m14", name: "Cerveja 600ml", price: 14.0, quantity: 3, notes: "" },
    ],
    status: "paga",
    paymentMethod: "credito",
    openedAt: new Date(Date.now() - 3600000 * 4),
    closedAt: new Date(Date.now() - 3600000 * 3),
    customerCount: 3,
    amountPaid: 124.0,
  },
];


const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const orderTotal = (items: OrderItem[]) =>
  items.reduce((s, i) => s + i.price * i.quantity, 0);

const generateId = () => Math.random().toString(36).slice(2, 9);

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  credito: "Cartão Crédito",
  debito: "Cartão Débito",
  pix: "PIX",
};

const STATUS_COLORS: Record<TableStatus, string> = {
  livre: "bg-emerald-100 text-emerald-800 border-emerald-300",
  ocupada: "bg-amber-100 text-amber-800 border-amber-300",
  reservada: "bg-blue-100 text-blue-800 border-blue-300",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Badge({ status }: { status: TableStatus }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}


export default function App() {
  const [section, setSection] = useState<string>("dashboard");
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [comandaTableId, setComandaTableId] = useState<string | null>(null);

  const [paymentTableId, setPaymentTableId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("dinheiro");
  const [amountPaid, setAmountPaid] = useState<string>("");

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({});
  const [addingItem, setAddingItem] = useState(false);

  const [openTableModal, setOpenTableModal] = useState<Table | null>(null);
  const [customerCount, setCustomerCount] = useState(1);

  const [searchMenu, setSearchMenu] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [pendingItems, setPendingItems] = useState<OrderItem[]>([]);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  const todayOrders = orders.filter(
    (o) => o.status === "paga" && o.closedAt && o.closedAt > new Date(Date.now() - 86400000)
  );
  const todayRevenue = todayOrders.reduce((s, o) => s + orderTotal(o.items), 0);
  const occupiedTables = tables.filter((t) => t.status === "ocupada").length;

  const openOrders = orders.filter((o) => o.status === "aberta");

  const categories = ["Todos", ...Array.from(new Set(menuItems.map((m) => m.category)))];

  const filteredMenu = useMemo(() => {
    return menuItems.filter((m) => {
      const catOk = activeCategory === "Todos" || m.category === activeCategory;
      const searchOk = m.name.toLowerCase().includes(searchMenu.toLowerCase());
      return catOk && searchOk && m.available;
    });
  }, [menuItems, activeCategory, searchMenu]);

  const getTableOrder = (tableId: string) =>
    orders.find((o) => o.tableId === tableId && o.status === "aberta");

  const openTable = (table: Table, count: number) => {
    const newOrder: Order = {
      id: `o-${generateId()}`,
      tableId: table.id,
      tableNumber: table.number,
      items: [],
      status: "aberta",
      openedAt: new Date(),
      customerCount: count,
    };
    setOrders((prev) => [...prev, newOrder]);
    setTables((prev) =>
      prev.map((t) =>
        t.id === table.id
          ? { ...t, status: "ocupada", currentOrderId: newOrder.id, customerCount: count }
          : t
      )
    );
    setOpenTableModal(null);
    setComandaTableId(table.id);
    setSection("comanda");
  };

  const freeTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, status: "livre", currentOrderId: undefined, customerCount: undefined } : t
      )
    );
  };

  const addPendingItem = (item: MenuItem) => {
    setPendingItems((prev) => {
      const ex = prev.find((p) => p.menuItemId === item.id);
      if (ex) return prev.map((p) => p.menuItemId === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, notes: "" }];
    });
  };

  const removePendingItem = (menuItemId: string) => {
    setPendingItems((prev) => {
      const ex = prev.find((p) => p.menuItemId === menuItemId);
      if (ex && ex.quantity > 1) return prev.map((p) => p.menuItemId === menuItemId ? { ...p, quantity: p.quantity - 1 } : p);
      return prev.filter((p) => p.menuItemId !== menuItemId);
    });
  };

  const confirmAddItems = (orderId: string) => {
    const itemsWithNotes = pendingItems.map((p) => ({ ...p, notes: itemNotes[p.menuItemId] || "" }));
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const merged = [...o.items];
        for (const ni of itemsWithNotes) {
          const idx = merged.findIndex((m) => m.menuItemId === ni.menuItemId);
          if (idx >= 0) merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + ni.quantity };
          else merged.push(ni);
        }
        return { ...o, items: merged };
      })
    );
    setPendingItems([]);
    setItemNotes({});
  };

  const removeOrderItem = (orderId: string, menuItemId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, items: o.items.filter((i) => i.menuItemId !== menuItemId) } : o
      )
    );
  };

  const changeOrderItemQty = (orderId: string, menuItemId: string, delta: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const items = o.items
          .map((i) => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + delta } : i)
          .filter((i) => i.quantity > 0);
        return { ...o, items };
      })
    );
  };

  const processPayment = (orderId: string, tableId: string) => {
    const paid = parseFloat(amountPaid.replace(",", ".")) || 0;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "paga", paymentMethod, amountPaid: paid, closedAt: new Date() }
          : o
      )
    );
    freeTable(tableId);
    setPaymentTableId(null);
    setAmountPaid("");
    setPaymentMethod("dinheiro");
    setSection("mesas");
  };

  const saveMenuItem = () => {
    if (!editingItem) return;
    setMenuItems((prev) => prev.map((m) => (m.id === editingItem.id ? editingItem : m)));
    setEditingItem(null);
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: `m-${generateId()}`,
      category: newItem.category || "Lanches",
      name: newItem.name,
      price: parseFloat(String(newItem.price)),
      available: true,
    };
    setMenuItems((prev) => [...prev, item]);
    setNewItem({});
    setAddingItem(false);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mesas", label: "Mesas", icon: UtensilsCrossed },
    { id: "comanda", label: "Comanda", icon: ClipboardList },
    { id: "pagamento", label: "Pagamento", icon: CreditCard },
    { id: "cardapio", label: "Cardápio", icon: BookOpen },
    { id: "historico", label: "Histórico", icon: History },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r border-sidebar-border"
        style={{ backgroundColor: "var(--sidebar)", color: "var(--sidebar-foreground)" }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-sidebar-border">
          <h1
            className="text-xl font-bold leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif", color: "var(--sidebar-foreground)" }}
          >
            SendYourWish
          </h1>
          <p className="text-xs mt-0.5 opacity-60 tracking-widest uppercase">Lanchonete</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                style={{
                  backgroundColor: active ? "var(--sidebar-accent)" : "transparent",
                  color: active ? "var(--sidebar-foreground)" : "#9999",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon size={18} />
                {label}
                {id === "comanda" && openOrders.length > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {openOrders.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <p className="text-[11px] opacity-40">v1.0.0 · 2025</p>
        </div>
      </aside>

      {/* ── Main  ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {navItems.find((n) => n.id === section)?.label}
            </h2>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Sistema Online</span>
          </div>
        </header>

        {/* Page */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ══════════ DASHBOARD ══════════ */}
          {section === "dashboard" && (
            <div className="space-y-6 max-w-5xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={DollarSign} label="Faturamento Hoje" value={fmt(todayRevenue)} sub={`${todayOrders.length} pedidos`} color="primary" />
                <StatCard icon={UtensilsCrossed} label="Mesas Ocupadas" value={`${occupiedTables}/${tables.length}`} sub="neste momento" color="amber" />
                <StatCard icon={ClipboardList} label="Comandas Abertas" value={String(openOrders.length)} sub="em andamento" color="blue" />
                <StatCard icon={TrendingUp} label="Ticket Médio" value={todayOrders.length ? fmt(todayRevenue / todayOrders.length) : "—"} sub="por comanda" color="green" />
              </div>

              {/* Mesa com pedidos abertos */}
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Comandas em Aberto
                  </h3>
                  <button
                    onClick={() => setSection("mesas")}
                    className="text-sm text-primary flex items-center gap-1 hover:underline"
                  >
                    Ver mesas <ChevronRight size={14} />
                  </button>
                </div>
                {openOrders.length === 0 ? (
                  <div className="px-6 py-10 text-center text-muted-foreground text-sm">
                    Nenhuma comanda aberta no momento.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {openOrders.map((o) => (
                      <div key={o.id} className="px-6 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {o.tableNumber}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Mesa {o.tableNumber}</p>
                            <p className="text-xs text-muted-foreground">{o.items.length} itens · {o.customerCount} pessoa(s)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-foreground">{fmt(orderTotal(o.items))}</span>
                          <button
                            onClick={() => { setComandaTableId(o.tableId); setSection("comanda"); }}
                            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition"
                          >
                            Ver Comanda
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Histórico */}
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Últimas Vendas
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {orders.filter((o) => o.status === "paga").slice(-5).reverse().map((o) => (
                    <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Mesa {o.tableNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {o.closedAt?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · {o.paymentMethod ? PAYMENT_LABELS[o.paymentMethod] : "—"}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{fmt(orderTotal(o.items))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ MESAS ══════════ */}
          {section === "mesas" && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" /> Livre</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Ocupada</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block" /> Reservada</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {tables.map((table) => {
                  const order = getTableOrder(table.id);
                  const isOccupied = table.status === "ocupada";
                  return (
                    <div
                      key={table.id}
                      className="bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                      onClick={() => {
                        if (table.status === "livre") {
                          setOpenTableModal(table);
                          setCustomerCount(1);
                        } else if (isOccupied) {
                          setComandaTableId(table.id);
                          setSection("comanda");
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {table.number}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${table.status === "livre" ? "bg-emerald-400" : table.status === "ocupada" ? "bg-amber-400" : "bg-blue-400"}`} />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground"><Users size={10} className="inline mr-0.5" />{table.capacity} lugares</p>
                        {isOccupied && order && (
                          <p className="text-[11px] font-bold text-primary mt-0.5">{fmt(orderTotal(order.items))}</p>
                        )}
                        {isOccupied && table.customerCount && (
                          <p className="text-[10px] text-muted-foreground">{table.customerCount} pessoa(s)</p>
                        )}
                      </div>
                      <Badge status={table.status} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════ COMANDA ══════════ */}
          {section === "comanda" && (() => {
            const activeTable = tables.find((t) => t.id === comandaTableId);
            const activeOrder = activeTable ? getTableOrder(activeTable.id) : null;

            if (!activeTable || !activeOrder) {
              return (
                <div className="max-w-3xl space-y-4">
                  <p className="text-muted-foreground text-sm">Selecione uma mesa com comanda aberta:</p>
                  {openOrders.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
                      Nenhuma comanda aberta. Abra uma mesa primeiro.
                      <br />
                      <button onClick={() => setSection("mesas")} className="mt-4 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition">
                        Ir para Mesas
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {openOrders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setComandaTableId(o.tableId)}
                          className="bg-card rounded-xl border border-border p-4 text-left hover:border-primary transition-colors"
                        >
                          <p className="font-bold text-foreground">Mesa {o.tableNumber}</p>
                          <p className="text-xs text-muted-foreground">{o.items.length} itens · {fmt(orderTotal(o.items))}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const pendingTotal = orderTotal(pendingItems);

            return (
              <div className="flex gap-4 h-full max-h-[calc(100vh-13rem)]">

                {/* Menu de Seleção */}
                <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Mesa {activeTable.number} · {activeTable.customerCount} pessoa(s)</p>
                    <input
                      className="w-full text-sm bg-input-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring/40"
                      placeholder="Buscar item..."
                      value={searchMenu}
                      onChange={(e) => setSearchMenu(e.target.value)}
                    />
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setActiveCategory(c)}
                          className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
                          style={{
                            backgroundColor: activeCategory === c ? "var(--primary)" : "transparent",
                            color: activeCategory === c ? "var(--primary-foreground)" : "var(--muted-foreground)",
                            borderColor: activeCategory === c ? "var(--primary)" : "var(--border)",
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-1.5">
                    {filteredMenu.map((item) => {
                      const inPending = pendingItems.find((p) => p.menuItemId === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => addPendingItem(item)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {inPending && (
                              <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {inPending.quantity}
                              </span>
                            )}
                            <span className="text-sm font-bold text-primary">{fmt(item.price)}</span>
                            <Plus size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {pendingItems.length > 0 && (
                    <div className="border-t border-border px-4 py-3 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-foreground">A adicionar ({pendingItems.length} itens) · {fmt(pendingTotal)}</p>
                        <button onClick={() => setPendingItems([])} className="text-xs text-destructive hover:underline">Limpar</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {pendingItems.map((p) => (
                          <div key={p.menuItemId} className="flex items-center gap-1 bg-card border border-border rounded-full px-2 py-0.5 text-xs">
                            <button onClick={() => removePendingItem(p.menuItemId)} className="text-muted-foreground hover:text-destructive">
                              <Minus size={10} />
                            </button>
                            <span>{p.quantity}× {p.name}</span>
                            <button onClick={() => addPendingItem({ id: p.menuItemId, name: p.name, price: p.price, category: "", available: true })} className="text-muted-foreground hover:text-primary">
                              <Plus size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => confirmAddItems(activeOrder.id)}
                        className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition"
                      >
                        Confirmar Lançamento
                      </button>
                    </div>
                  )}
                </div>

                {/* Order panel */}
                <div className="w-72 flex-shrink-0 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Comanda — Mesa {activeTable.number}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Aberta às {activeOrder.openedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-border">
                    {activeOrder.items.length === 0 ? (
                      <p className="p-6 text-sm text-center text-muted-foreground">Nenhum item lançado.</p>
                    ) : (
                      activeOrder.items.map((item) => (
                        <div key={item.menuItemId} className="px-4 py-2.5 flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{fmt(item.price)} un.</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => changeOrderItemQty(activeOrder.id, item.menuItemId, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center border border-border hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => changeOrderItemQty(activeOrder.id, item.menuItemId, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center border border-border hover:bg-primary/10 hover:border-primary/30 transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-foreground w-14 text-right">{fmt(item.price * item.quantity)}</span>
                          <button onClick={() => removeOrderItem(activeOrder.id, item.menuItemId)} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-border px-4 py-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="text-sm font-bold">{fmt(orderTotal(activeOrder.items))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pessoas</span>
                      <span className="text-sm">{activeTable.customerCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Por pessoa</span>
                      <span className="text-xs">
                        {activeTable.customerCount && activeTable.customerCount > 0
                          ? fmt(orderTotal(activeOrder.items) / activeTable.customerCount)
                          : "—"}
                      </span>
                    </div>
                    <button
                      onClick={() => { setPaymentTableId(activeTable.id); setSection("pagamento"); }}
                      disabled={activeOrder.items.length === 0}
                      className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                    >
                      Fechar Conta
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════ PAGAMENTO ══════════ */}
          {section === "pagamento" && (() => {
            const payTable = paymentTableId ? tables.find((t) => t.id === paymentTableId) : null;
            const payOrder = payTable ? getTableOrder(payTable.id) : null;

            if (!payTable || !payOrder) {
              return (
                <div className="max-w-3xl space-y-4">
                  <p className="text-sm text-muted-foreground">Selecione uma mesa para fechar a conta:</p>
                  {openOrders.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
                      Nenhuma comanda aberta para fechar.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {openOrders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setPaymentTableId(o.tableId)}
                          className="bg-card rounded-xl border border-border p-4 text-left hover:border-primary transition-colors"
                        >
                          <p className="font-bold">Mesa {o.tableNumber}</p>
                          <p className="text-xs text-muted-foreground">{fmt(orderTotal(o.items))}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const total = orderTotal(payOrder.items);
            const paid = parseFloat(amountPaid.replace(",", ".")) || 0;
            const change = paid - total;

            const payMethods: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
              { id: "dinheiro", label: "Dinheiro", icon: Banknote },
              { id: "credito", label: "Crédito", icon: CreditCard },
              { id: "debito", label: "Débito", icon: CreditCard },
              { id: "pix", label: "PIX", icon: Smartphone },
            ];

            return (
              <div className="max-w-lg space-y-4">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-primary px-6 py-4">
                    <p className="text-primary-foreground/70 text-xs uppercase tracking-widest">Mesa {payTable.number}</p>
                    <p className="text-primary-foreground text-3xl font-bold mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {fmt(total)}
                    </p>
                    <p className="text-primary-foreground/60 text-xs mt-0.5">{payOrder.items.length} itens · {payTable.customerCount} pessoa(s)</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Sumário de Itens */}
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {payOrder.items.map((item) => (
                        <div key={item.menuItemId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                          <span className="font-medium">{fmt(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-4">
                      {/* Método de Pagamento */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Forma de Pagamento</p>
                        <div className="grid grid-cols-2 gap-2">
                          {payMethods.map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              onClick={() => setPaymentMethod(id)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all"
                              style={{
                                borderColor: paymentMethod === id ? "var(--primary)" : "var(--border)",
                                backgroundColor: paymentMethod === id ? "var(--primary)" : "transparent",
                                color: paymentMethod === id ? "var(--primary-foreground)" : "var(--foreground)",
                                fontWeight: paymentMethod === id ? 600 : 400,
                              }}
                            >
                              <Icon size={15} />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Apenas dinheiro */}
                      {paymentMethod === "dinheiro" && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Valor Recebido</p>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring/40"
                              placeholder="0,00"
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                            />
                          </div>
                          {paid > 0 && (
                            <div className={`mt-2 flex items-center gap-2 text-sm font-semibold ${change >= 0 ? "text-emerald-700" : "text-destructive"}`}>
                              {change >= 0
                                ? <><Check size={14} /> Troco: {fmt(change)}</>
                                : <><AlertCircle size={14} /> Faltam: {fmt(Math.abs(change))}</>
                              }
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => processPayment(payOrder.id, payTable.id)}
                        disabled={paymentMethod === "dinheiro" && paid < total}
                        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        Confirmar Pagamento
                      </button>

                      <button
                        onClick={() => { setPaymentTableId(null); setSection("mesas"); }}
                        className="w-full text-sm text-muted-foreground hover:text-foreground transition py-1"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════ CARDÁPIO ══════════ */}
          {section === "cardapio" && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{menuItems.length} itens cadastrados</p>
                <button
                  onClick={() => { setAddingItem(true); setNewItem({}); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  <Plus size={15} /> Novo Item
                </button>
              </div>

              {addingItem && (
                <div className="bg-card rounded-xl border border-primary shadow-sm p-5">
                  <h4 className="font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Novo Item</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Nome</label>
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring/40"
                        value={newItem.name || ""}
                        onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Nome do item"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Categoria</label>
                      <select
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring/40"
                        value={newItem.category || "Lanches"}
                        onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
                      >
                        {["Lanches", "Porções", "Bebidas", "Sobremesas", "Combos"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring/40"
                        value={newItem.price || ""}
                        onChange={(e) => setNewItem((p) => ({ ...p, price: parseFloat(e.target.value) }))}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={addMenuItem} className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-1.5">
                      <Save size={14} /> Salvar
                    </button>
                    <button onClick={() => setAddingItem(false)} className="text-sm text-muted-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {categories.filter((c) => c !== "Todos").map((cat) => {
                const items = menuItems.filter((m) => m.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-border bg-muted/30">
                      <h3 className="font-semibold text-foreground text-sm">{cat}</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                          {editingItem?.id === item.id ? (
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <input
                                className="col-span-2 border border-border rounded-lg px-2 py-1.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring/40"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem((p) => p ? { ...p, name: e.target.value } : p)}
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="border border-border rounded-lg px-2 py-1.5 text-sm bg-input-background outline-none focus:ring-2 focus:ring-ring/40"
                                value={editingItem.price}
                                onChange={(e) => setEditingItem((p) => p ? { ...p, price: parseFloat(e.target.value) } : p)}
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.available ? "Disponível" : "Indisponível"}</p>
                            </div>
                          )}
                          <span className="text-sm font-bold text-primary w-20 text-right flex-shrink-0">{fmt(item.price)}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setMenuItems((prev) => prev.map((m) => m.id === item.id ? { ...m, available: !m.available } : m))}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${item.available ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-border bg-muted text-muted-foreground"}`}
                              title={item.available ? "Desativar" : "Ativar"}
                            >
                              <Check size={12} />
                            </button>
                            {editingItem?.id === item.id ? (
                              <button onClick={saveMenuItem} className="w-7 h-7 rounded-lg flex items-center justify-center border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Save size={12} />
                              </button>
                            ) : (
                              <button onClick={() => setEditingItem(item)} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors">
                                <Edit2 size={12} />
                              </button>
                            )}
                            <button onClick={() => deleteMenuItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border hover:border-destructive hover:text-destructive transition-colors">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════ HISTÓRICO ══════════ */}
          {section === "historico" && (() => {
            const closedOrders = orders.filter((o) => o.status === "paga").sort(
              (a, b) => (b.closedAt?.getTime() || 0) - (a.closedAt?.getTime() || 0)
            );
            const totalRevenue = closedOrders.reduce((s, o) => s + orderTotal(o.items), 0);

            return (
              <div className="max-w-4xl space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <StatCard icon={ShoppingBag} label="Total de Pedidos" value={String(closedOrders.length)} color="primary" />
                  <StatCard icon={DollarSign} label="Receita Total" value={fmt(totalRevenue)} color="green" />
                  <StatCard icon={TrendingUp} label="Ticket Médio" value={closedOrders.length ? fmt(totalRevenue / closedOrders.length) : "—"} color="amber" />
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>Histórico de Vendas</h3>
                  </div>
                  {closedOrders.length === 0 ? (
                    <p className="p-10 text-center text-sm text-muted-foreground">Nenhuma venda registrada ainda.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {closedOrders.map((o) => (
                        <details key={o.id} className="group">
                          <summary className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors list-none">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {o.tableNumber}
                              </div>
                              <div>
                                <p className="text-sm font-semibold">Mesa {o.tableNumber}</p>
                                <p className="text-xs text-muted-foreground">
                                  {o.closedAt?.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                  {" · "}{o.paymentMethod ? PAYMENT_LABELS[o.paymentMethod] : "—"}
                                  {" · "}{o.customerCount} pessoa(s)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold">{fmt(orderTotal(o.items))}</span>
                              <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                            </div>
                          </summary>
                          <div className="px-6 pb-3 bg-muted/20 border-t border-border">
                            <div className="pt-3 space-y-1">
                              {o.items.map((item) => (
                                <div key={item.menuItemId} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                                  <span>{fmt(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border mt-2">
                                <span>Total</span>
                                <span>{fmt(orderTotal(o.items))}</span>
                              </div>
                              {o.paymentMethod === "dinheiro" && o.amountPaid && (
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Recebido</span>
                                  <span>{fmt(o.amountPaid)} → Troco: {fmt(o.amountPaid - orderTotal(o.items))}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      {/* ══════════ Abrir Mesa ══════════ */}
      {openTableModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Abrir Mesa {openTableModal.number}
              </h3>
              <button onClick={() => setOpenTableModal(null)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Número de Pessoas
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCustomerCount((c) => Math.max(1, c - 1))}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-2xl font-bold text-foreground w-10 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {customerCount}
                  </span>
                  <button
                    onClick={() => setCustomerCount((c) => Math.min(openTableModal.capacity, c + 1))}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Capacidade: {openTableModal.capacity} pessoas</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => openTable(openTableModal, customerCount)}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
                >
                  Abrir Mesa
                </button>
                <button
                  onClick={() => setOpenTableModal(null)}
                  className="px-4 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
