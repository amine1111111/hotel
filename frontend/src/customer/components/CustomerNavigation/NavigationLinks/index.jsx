import { ArrowUpRight } from "lucide-react";

import TransitionButton from "../../PageTransition/TransitionButton";

const NavigationLinks = ({ navigation, linkRefs, onNavigationClick }) => {
  return (
    <nav aria-label="Customer navigation">
      <ul className="space-y-2">
        {navigation.map((item, index) => (
          <li key={item.path}>
            <TransitionButton
              to={item.path}
              ref={(element) => {
                linkRefs.current[index] = element;
              }}
              onClick={() => onNavigationClick(item.path)}
              className="
                group
                inline-flex
                items-center
                gap-4
                text-4xl
                font-medium
                tracking-tight
                text-stone-100
                transition-colors
                duration-300
                hover:text-[#b89b72]
                sm:text-5xl
                lg:text-6xl
              "
            >
              <span>{item.label}</span>

              <ArrowUpRight
                size={24}
                strokeWidth={1.3}
                className="
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                  group-hover:opacity-100
                "
              />
            </TransitionButton>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationLinks;
