import {
	badgeVariant,
	bouncySpring,
	buttonFill,
	buttonPress,
	cardVariant,
	checkboxVariant,
	fadeIn,
	fadeInDown,
	fadeInUp,
	gentleSpring,
	gridItem,
	hoverScale,
	iconBounce,
	iconSpin,
	listItem,
	modalVariant,
	overlayVariant,
	pageVariant,
	progressVariant,
	scaleIn,
	skeletonVariant,
	slideInLeft,
	slideInRight,
	springConfig,
	staggeredGrid,
	staggeredList,
	tableRowVariant,
} from "@/lib/animations";

import { describe, expect, it } from "vitest";

describe("animations", () => {
	describe("fade animations", () => {
		it("fadeIn has required variants", () => {
			expect(fadeIn).toHaveProperty("hidden");
			expect(fadeIn).toHaveProperty("visible");
			expect(fadeIn).toHaveProperty("exit");
		});

		it("fadeIn hidden state has opacity 0", () => {
			expect(fadeIn.hidden).toEqual({ opacity: 0 });
		});

		it("fadeIn visible state has opacity 1 with transition", () => {
			expect(fadeIn.visible).toEqual({
				opacity: 1,
				transition: { duration: 0.3 },
			});
		});

		it("fadeIn exit state has correct values", () => {
			expect(fadeIn.exit).toEqual({
				opacity: 0,
				transition: { duration: 0.2 },
			});
		});

		it("fadeInUp has required variants", () => {
			expect(fadeInUp).toHaveProperty("hidden");
			expect(fadeInUp).toHaveProperty("visible");
		});

		it("fadeInUp hidden state starts below with opacity 0", () => {
			expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 20 });
		});

		it("fadeInUp visible state moves to position with easeOut", () => {
			expect(fadeInUp.visible).toEqual({
				opacity: 1,
				y: 0,
				transition: { duration: 0.4, ease: "easeOut" },
			});
		});

		it("fadeInUp exit moves up slightly", () => {
			expect(fadeInUp.exit).toEqual({
				opacity: 0,
				y: -10,
				transition: { duration: 0.2 },
			});
		});

		it("fadeInDown has required variants", () => {
			expect(fadeInDown).toHaveProperty("hidden");
			expect(fadeInDown).toHaveProperty("visible");
		});

		it("fadeInDown hidden state starts above with opacity 0", () => {
			expect(fadeInDown.hidden).toEqual({ opacity: 0, y: -20 });
		});

		it("fadeInDown visible state moves to position", () => {
			expect(fadeInDown.visible).toEqual({
				opacity: 1,
				y: 0,
				transition: { duration: 0.4, ease: "easeOut" },
			});
		});

		it("fadeInDown exit moves down slightly", () => {
			expect(fadeInDown.exit).toEqual({
				opacity: 0,
				y: 10,
				transition: { duration: 0.2 },
			});
		});
	});

	describe("slide animations", () => {
		it("slideInLeft has required variants", () => {
			expect(slideInLeft).toHaveProperty("hidden");
			expect(slideInLeft).toHaveProperty("visible");
		});

		it("slideInLeft hidden state starts from left", () => {
			expect(slideInLeft.hidden).toEqual({ opacity: 0, x: -30 });
		});

		it("slideInLeft visible state slides to center", () => {
			expect(slideInLeft.visible).toEqual({
				opacity: 1,
				x: 0,
				transition: { duration: 0.4, ease: "easeOut" },
			});
		});

		it("slideInLeft exit slides back left", () => {
			expect(slideInLeft.exit).toEqual({
				opacity: 0,
				x: -20,
				transition: { duration: 0.2 },
			});
		});

		it("slideInRight has required variants", () => {
			expect(slideInRight).toHaveProperty("hidden");
			expect(slideInRight).toHaveProperty("visible");
		});

		it("slideInRight hidden state starts from right", () => {
			expect(slideInRight.hidden).toEqual({ opacity: 0, x: 30 });
		});

		it("slideInRight visible state slides to center", () => {
			expect(slideInRight.visible).toEqual({
				opacity: 1,
				x: 0,
				transition: { duration: 0.4, ease: "easeOut" },
			});
		});

		it("slideInRight exit slides back right", () => {
			expect(slideInRight.exit).toEqual({
				opacity: 0,
				x: 20,
				transition: { duration: 0.2 },
			});
		});
	});

	describe("scale animations", () => {
		it("scaleIn has required variants", () => {
			expect(scaleIn).toHaveProperty("hidden");
			expect(scaleIn).toHaveProperty("visible");
		});

		it("scaleIn hidden state starts scaled down", () => {
			expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.9 });
		});

		it("scaleIn visible state scales to full size", () => {
			expect(scaleIn.visible).toEqual({
				opacity: 1,
				scale: 1,
				transition: { duration: 0.3, ease: "easeOut" },
			});
		});

		it("scaleIn exit scales down slightly", () => {
			expect(scaleIn.exit).toEqual({
				opacity: 0,
				scale: 0.95,
				transition: { duration: 0.2 },
			});
		});

		it("hoverScale has required variants", () => {
			expect(hoverScale).toHaveProperty("rest");
			expect(hoverScale).toHaveProperty("hover");
			expect(hoverScale).toHaveProperty("tap");
		});

		it("hoverScale rest state has scale 1", () => {
			expect(hoverScale.rest).toEqual({ scale: 1 });
		});

		it("hoverScale hover state scales up with shadow", () => {
			expect(hoverScale.hover).toEqual({
				scale: 1.02,
				y: -2,
				boxShadow:
					"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
				transition: { duration: 0.2, ease: "easeOut" },
			});
		});

		it("hoverScale tap state scales down", () => {
			expect(hoverScale.tap).toEqual({
				scale: 0.98,
				transition: { duration: 0.1 },
			});
		});
	});

	describe("button animations", () => {
		it("buttonPress has required variants", () => {
			expect(buttonPress).toHaveProperty("rest");
			expect(buttonPress).toHaveProperty("hover");
			expect(buttonPress).toHaveProperty("tap");
		});

		it("buttonPress rest state has scale 1", () => {
			expect(buttonPress.rest).toEqual({ scale: 1 });
		});

		it("buttonPress hover scales up", () => {
			expect(buttonPress.hover).toEqual({
				scale: 1.05,
				transition: { duration: 0.2 },
			});
		});

		it("buttonPress tap scales down", () => {
			expect(buttonPress.tap).toEqual({
				scale: 0.95,
				transition: { duration: 0.1 },
			});
		});

		it("buttonFill has required variants", () => {
			expect(buttonFill).toHaveProperty("rest");
			expect(buttonFill).toHaveProperty("hover");
			expect(buttonFill).toHaveProperty("tap");
		});

		it("buttonFill rest uses CSS variables", () => {
			expect(buttonFill.rest).toEqual({
				scale: 1,
				backgroundColor: "var(--background)",
			});
		});

		it("buttonFill hover changes background color", () => {
			expect(buttonFill.hover).toEqual({
				scale: 1.02,
				backgroundColor: "var(--accent)",
				transition: { duration: 0.2 },
			});
		});

		it("buttonFill tap scales down", () => {
			expect(buttonFill.tap).toEqual({ scale: 0.98 });
		});
	});

	describe("list animations", () => {
		it("staggeredList has required variants", () => {
			expect(staggeredList).toHaveProperty("hidden");
			expect(staggeredList).toHaveProperty("visible");
		});

		it("staggeredList hidden state has opacity 0", () => {
			expect(staggeredList.hidden).toEqual({ opacity: 0 });
		});

		it("staggeredList visible has stagger configuration", () => {
			expect(staggeredList.visible).toEqual({
				opacity: 1,
				transition: {
					staggerChildren: 0.1,
					delayChildren: 0.2,
				},
			});
		});

		it("listItem has required variants", () => {
			expect(listItem).toHaveProperty("hidden");
			expect(listItem).toHaveProperty("visible");
		});

		it("listItem hidden starts below with opacity 0", () => {
			expect(listItem.hidden).toEqual({ opacity: 0, y: 20 });
		});

		it("listItem visible animates into place", () => {
			expect(listItem.visible).toEqual({
				opacity: 1,
				y: 0,
				transition: { duration: 0.4, ease: "easeOut" },
			});
		});
	});

	describe("grid animations", () => {
		it("staggeredGrid has required variants", () => {
			expect(staggeredGrid).toHaveProperty("hidden");
			expect(staggeredGrid).toHaveProperty("visible");
		});

		it("staggeredGrid hidden has opacity 0", () => {
			expect(staggeredGrid.hidden).toEqual({ opacity: 0 });
		});

		it("staggeredGrid visible has stagger with longer delay", () => {
			expect(staggeredGrid.visible).toEqual({
				opacity: 1,
				transition: {
					staggerChildren: 0.1,
					delayChildren: 0.3,
				},
			});
		});

		it("gridItem has required variants", () => {
			expect(gridItem).toHaveProperty("hidden");
			expect(gridItem).toHaveProperty("visible");
			expect(gridItem).toHaveProperty("hover");
		});

		it("gridItem hidden starts scaled down and below", () => {
			expect(gridItem.hidden).toEqual({ opacity: 0, scale: 0.95, y: 20 });
		});

		it("gridItem visible animates to full size and position", () => {
			expect(gridItem.visible).toEqual({
				opacity: 1,
				scale: 1,
				y: 0,
				transition: { duration: 0.4, ease: "easeOut" },
			});
		});

		it("gridItem hover lifts and adds shadow", () => {
			expect(gridItem.hover).toEqual({
				scale: 1.02,
				y: -4,
				boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
				transition: { duration: 0.2, ease: "easeOut" },
			});
		});
	});

	describe("modal animations", () => {
		it("modalVariant has required variants", () => {
			expect(modalVariant).toHaveProperty("hidden");
			expect(modalVariant).toHaveProperty("visible");
			expect(modalVariant).toHaveProperty("exit");
		});

		it("modalVariant hidden starts scaled and below", () => {
			expect(modalVariant.hidden).toEqual({ opacity: 0, scale: 0.95, y: 20 });
		});

		it("modalVariant visible animates to full", () => {
			expect(modalVariant.visible).toEqual({
				opacity: 1,
				scale: 1,
				y: 0,
				transition: { duration: 0.3, ease: "easeOut" },
			});
		});

		it("modalVariant exit uses easeIn for closing", () => {
			expect(modalVariant.exit).toEqual({
				opacity: 0,
				scale: 0.95,
				y: 10,
				transition: { duration: 0.2, ease: "easeIn" },
			});
		});

		it("overlayVariant has required variants", () => {
			expect(overlayVariant).toHaveProperty("hidden");
			expect(overlayVariant).toHaveProperty("visible");
			expect(overlayVariant).toHaveProperty("exit");
		});

		it("overlayVariant hidden has opacity 0", () => {
			expect(overlayVariant.hidden).toEqual({ opacity: 0 });
		});

		it("overlayVariant visible fades in", () => {
			expect(overlayVariant.visible).toEqual({
				opacity: 1,
				transition: { duration: 0.2 },
			});
		});

		it("overlayVariant exit fades out", () => {
			expect(overlayVariant.exit).toEqual({
				opacity: 0,
				transition: { duration: 0.2 },
			});
		});
	});

	describe("progressVariant", () => {
		it("progressVariant has required variants", () => {
			expect(progressVariant).toHaveProperty("hidden");
			expect(progressVariant).toHaveProperty("visible");
		});

		it("progressVariant hidden starts at 0%", () => {
			expect(progressVariant.hidden).toEqual({ width: "0%" });
		});

		it("progressVariant visible is a function that returns width", () => {
			expect(typeof progressVariant.visible).toBe("function");
		});

		it("progressVariant visible function returns correct width for 0%", () => {
			const visibleFn = progressVariant.visible as (progress: number) => object;
			const result = visibleFn(0);
			expect(result).toEqual({
				width: "0%",
				transition: { duration: 1.2, ease: "easeOut", delay: 0.5 },
			});
		});

		it("progressVariant visible function returns correct width for 50%", () => {
			const visibleFn = progressVariant.visible as (progress: number) => object;
			const result = visibleFn(50);
			expect(result).toEqual({
				width: "50%",
				transition: { duration: 1.2, ease: "easeOut", delay: 0.5 },
			});
		});

		it("progressVariant visible function returns correct width for 100%", () => {
			const visibleFn = progressVariant.visible as (progress: number) => object;
			const result = visibleFn(100);
			expect(result).toEqual({
				width: "100%",
				transition: { duration: 1.2, ease: "easeOut", delay: 0.5 },
			});
		});

		it("progressVariant visible function handles decimal values", () => {
			const visibleFn = progressVariant.visible as (progress: number) => object;
			const result = visibleFn(33.5);
			expect(result).toEqual({
				width: "33.5%",
				transition: { duration: 1.2, ease: "easeOut", delay: 0.5 },
			});
		});
	});

	describe("checkboxVariant", () => {
		it("checkboxVariant has required variants", () => {
			expect(checkboxVariant).toHaveProperty("unchecked");
			expect(checkboxVariant).toHaveProperty("checked");
		});

		it("checkboxVariant unchecked is at rest state", () => {
			expect(checkboxVariant.unchecked).toEqual({ scale: 1, rotate: 0 });
		});

		it("checkboxVariant checked scales and rotates slightly", () => {
			expect(checkboxVariant.checked).toEqual({
				scale: 1.1,
				rotate: 5,
				transition: { duration: 0.2, ease: "easeOut" },
			});
		});
	});

	describe("tableRowVariant", () => {
		it("tableRowVariant has required variants", () => {
			expect(tableRowVariant).toHaveProperty("rest");
			expect(tableRowVariant).toHaveProperty("hover");
			expect(tableRowVariant).toHaveProperty("tap");
		});

		it("tableRowVariant rest has transparent background", () => {
			expect(tableRowVariant.rest).toEqual({
				backgroundColor: "transparent",
				scale: 1,
				transition: { duration: 0.2 },
			});
		});

		it("tableRowVariant hover highlights with lift", () => {
			expect(tableRowVariant.hover).toEqual({
				backgroundColor: "var(--accent)",
				scale: 1.01,
				y: -1,
				boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.05)",
				transition: { duration: 0.2, ease: "easeOut" },
			});
		});

		it("tableRowVariant tap scales down slightly", () => {
			expect(tableRowVariant.tap).toEqual({
				scale: 0.99,
				transition: { duration: 0.1 },
			});
		});
	});

	describe("cardVariant", () => {
		it("cardVariant has required variants", () => {
			expect(cardVariant).toHaveProperty("rest");
			expect(cardVariant).toHaveProperty("hover");
		});

		it("cardVariant rest has subtle shadow", () => {
			expect(cardVariant.rest).toEqual({
				y: 0,
				boxShadow:
					"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
				transition: { duration: 0.2 },
			});
		});

		it("cardVariant hover lifts with larger shadow", () => {
			expect(cardVariant.hover).toEqual({
				y: -4,
				boxShadow:
					"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
				transition: { duration: 0.3, ease: "easeOut" },
			});
		});
	});

	describe("badgeVariant", () => {
		it("badgeVariant has required variants", () => {
			expect(badgeVariant).toHaveProperty("hidden");
			expect(badgeVariant).toHaveProperty("visible");
		});

		it("badgeVariant hidden starts scaled down", () => {
			expect(badgeVariant.hidden).toEqual({ opacity: 0, scale: 0.8 });
		});

		it("badgeVariant visible pops in", () => {
			expect(badgeVariant.visible).toEqual({
				opacity: 1,
				scale: 1,
				transition: { duration: 0.3, ease: "easeOut" },
			});
		});
	});

	describe("skeletonVariant", () => {
		it("skeletonVariant has required variants", () => {
			expect(skeletonVariant).toHaveProperty("loading");
			expect(skeletonVariant).toHaveProperty("loaded");
		});

		it("skeletonVariant loading pulses opacity", () => {
			expect(skeletonVariant.loading).toEqual({
				opacity: [0.5, 1, 0.5],
				transition: {
					duration: 1.5,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				},
			});
		});

		it("skeletonVariant loaded fades out", () => {
			expect(skeletonVariant.loaded).toEqual({
				opacity: 0,
				transition: { duration: 0.3 },
			});
		});
	});

	describe("icon animations", () => {
		it("iconSpin has required variants", () => {
			expect(iconSpin).toHaveProperty("rest");
			expect(iconSpin).toHaveProperty("hover");
		});

		it("iconSpin rest has no rotation", () => {
			expect(iconSpin.rest).toEqual({ rotate: 0 });
		});

		it("iconSpin hover rotates 360 degrees", () => {
			expect(iconSpin.hover).toEqual({
				rotate: 360,
				transition: { duration: 0.6, ease: "easeInOut" },
			});
		});

		it("iconBounce has required variants", () => {
			expect(iconBounce).toHaveProperty("rest");
			expect(iconBounce).toHaveProperty("hover");
		});

		it("iconBounce rest is at y position 0", () => {
			expect(iconBounce.rest).toEqual({ y: 0 });
		});

		it("iconBounce hover bounces up and down", () => {
			expect(iconBounce.hover).toEqual({
				y: -2,
				transition: {
					duration: 0.2,
					repeat: 2,
					repeatType: "reverse",
				},
			});
		});
	});

	describe("page animations", () => {
		it("pageVariant has required variants", () => {
			expect(pageVariant).toHaveProperty("hidden");
			expect(pageVariant).toHaveProperty("visible");
			expect(pageVariant).toHaveProperty("exit");
		});

		it("pageVariant hidden starts below with opacity 0", () => {
			expect(pageVariant.hidden).toEqual({ opacity: 0, y: 20 });
		});

		it("pageVariant visible has staggerChildren for child animations", () => {
			expect(pageVariant.visible).toEqual({
				opacity: 1,
				y: 0,
				transition: {
					duration: 0.5,
					ease: "easeOut",
					staggerChildren: 0.1,
				},
			});
		});

		it("pageVariant exit slides up with easeIn", () => {
			expect(pageVariant.exit).toEqual({
				opacity: 0,
				y: -20,
				transition: { duration: 0.3, ease: "easeIn" },
			});
		});
	});

	describe("spring configs", () => {
		it("springConfig has type spring", () => {
			expect(springConfig.type).toBe("spring");
			expect(springConfig).toHaveProperty("stiffness");
			expect(springConfig).toHaveProperty("damping");
		});

		it("springConfig has correct values", () => {
			expect(springConfig).toEqual({
				type: "spring",
				stiffness: 300,
				damping: 30,
			});
		});

		it("gentleSpring has type spring", () => {
			expect(gentleSpring.type).toBe("spring");
		});

		it("gentleSpring has lower stiffness than default", () => {
			expect(gentleSpring).toEqual({
				type: "spring",
				stiffness: 200,
				damping: 25,
			});
		});

		it("gentleSpring is less stiff than springConfig", () => {
			expect(gentleSpring.stiffness).toBeLessThan(springConfig.stiffness);
		});

		it("bouncySpring has type spring", () => {
			expect(bouncySpring.type).toBe("spring");
		});

		it("bouncySpring has higher stiffness and lower damping", () => {
			expect(bouncySpring).toEqual({
				type: "spring",
				stiffness: 400,
				damping: 15,
			});
		});

		it("bouncySpring is stiffer and bouncier than others", () => {
			expect(bouncySpring.stiffness).toBeGreaterThan(springConfig.stiffness);
			expect(bouncySpring.damping).toBeLessThan(springConfig.damping);
		});
	});

	describe("animation timing consistency", () => {
		it("all exit transitions are faster than visible transitions", () => {
			// fadeIn: visible 0.3, exit 0.2
			const fadeInVisible = fadeIn.visible as {
				transition: { duration: number };
			};
			const fadeInExit = fadeIn.exit as { transition: { duration: number } };
			expect(fadeInExit.transition.duration).toBeLessThan(
				fadeInVisible.transition.duration,
			);

			// modalVariant: visible 0.3, exit 0.2
			const modalVisible = modalVariant.visible as {
				transition: { duration: number };
			};
			const modalExit = modalVariant.exit as {
				transition: { duration: number };
			};
			expect(modalExit.transition.duration).toBeLessThan(
				modalVisible.transition.duration,
			);

			// pageVariant: visible 0.5, exit 0.3
			const pageVisible = pageVariant.visible as {
				transition: { duration: number };
			};
			const pageExit = pageVariant.exit as { transition: { duration: number } };
			expect(pageExit.transition.duration).toBeLessThan(
				pageVisible.transition.duration,
			);
		});

		it("tap animations are fastest", () => {
			const hoverScaleHover = hoverScale.hover as {
				transition: { duration: number };
			};
			const hoverScaleTap = hoverScale.tap as {
				transition: { duration: number };
			};
			expect(hoverScaleTap.transition.duration).toBeLessThan(
				hoverScaleHover.transition.duration,
			);

			const buttonPressHover = buttonPress.hover as {
				transition: { duration: number };
			};
			const buttonPressTap = buttonPress.tap as {
				transition: { duration: number };
			};
			expect(buttonPressTap.transition.duration).toBeLessThan(
				buttonPressHover.transition.duration,
			);
		});
	});
});
