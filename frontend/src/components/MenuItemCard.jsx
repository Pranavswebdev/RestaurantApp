import { useState } from 'react';
import useCartStore from '../stores/cartStore';
import { getFoodImage } from '../utils/foodImages';

export default function MenuItemCard({ item, cuisines = [] }) {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);
  const [imgFailed, setImgFailed] = useState(false);

  const itemQuantity = cartItems.find((i) => i.id === item.id)?.quantity || 0;
  const imageUrl = getFoodImage(item.name, cuisines, 300);

  return (
    <div className="flex gap-4 py-4" data-testid={`menu-item-${item.id}`}>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
              item.isVeg ? 'border-veg' : 'border-nonveg'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-veg' : 'bg-nonveg'}`} />
          </span>
          <h3 className="font-semibold text-ink truncate">{item.name}</h3>
        </div>

        <p className="font-bold text-ink">₹{item.price}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted line-clamp-2">{item.description}</p>
      </div>

      {/* Image + ADD button */}
      <div className="relative w-28 shrink-0">
        <div className="h-24 w-28 overflow-hidden rounded-2xl bg-gray-100">
          {imgFailed ? (
            <div className="flex h-full w-full items-center justify-center text-3xl">🍽️</div>
          ) : (
            <img
              src={imageUrl}
              alt={item.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {item.isAvailable ? (
            itemQuantity > 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-3 py-1.5 shadow-md">
                <button
                  onClick={() => removeItem(item.id)}
                  data-testid={`remove-${item.id}`}
                  aria-label={`Remove ${item.name}`}
                  className="text-lg font-bold leading-none text-primary"
                >
                  −
                </button>
                <span data-testid={`qty-${item.id}`} className="w-4 text-center font-bold text-primary">
                  {itemQuantity}
                </span>
                <button
                  onClick={() => addItem(item)}
                  data-testid={`add-${item.id}`}
                  aria-label={`Add ${item.name}`}
                  className="text-lg font-bold leading-none text-primary"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item)}
                data-testid={`add-${item.id}`}
                aria-label={`Add ${item.name}`}
                className="rounded-xl border border-primary bg-white px-7 py-1.5 text-sm font-bold text-primary shadow-md transition hover:bg-primary hover:text-white"
              >
                ADD
              </button>
            )
          ) : (
            <span className="rounded-xl bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm whitespace-nowrap">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
