import Image from '@tiptap/extension-image';

export const ImageResize = Image.extend({
  inline: true,
  allowBase64: true,
  addAttributes() {
    return {
      //@ts-expect-error remove check
      ...this.parent?.(),
      style: {
        default: 'max-width: 100%; border-radius: 9px;',
        renderHTML: (attributes) => {
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const { view } = editor;
      const { style } = node.attrs;

      const container = document.createElement('div');
      container.setAttribute('style', `margin: 0 auto; cursor: default; position: relative; max-width: 100%; ${style}`);

      const content = document.createElement('div');
      content.setAttribute('style', 'min-width: 200px;');

      const img = document.createElement('img');
      img.setAttribute('style', 'max-width: 100%;');

      const dispatchNodeView = () => {
        if (typeof getPos === 'function') {
          const newAttrs = {
            ...node.attrs,
            style: `${img.style.cssText}`,
          };
          view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, newAttrs));
        }
      };

      let isResizing = false;
      let startX: number, startWidth: number;

      const paintPositionContoller = () => {
        const controllers = document.createElement('div');
        controllers.setAttribute(
          'style',
          'position: absolute; display: flex; align-items: center; justify-content: space-around; width: 100%; top: 0; bottom: 0; transition: all 3s ease-out;',
        );

        const leftController = document.createElement('div');
        const centerSpace = document.createElement('div');
        const rightController = document.createElement('div');

        const controlStyle =
          'width: 4px; border-radius: 12px; border-width: 1px; height: 100px; background: #FFFFFFB3; cursor: col-resize; margin: 0 15px;';
        leftController.setAttribute('style', controlStyle + 'left: 5px;');
        centerSpace.setAttribute('style', 'flex: 1;');
        rightController.setAttribute('style', controlStyle + 'right: 5px;');

        leftController.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isResizing = true;
          startX = e.clientX;
          startWidth = container.offsetWidth;

          const onMouseMove = (mountEvent: MouseEvent) => {
            if (!isResizing) return;
            const deltaX = -(mountEvent.clientX - startX);
            const newWidth = startWidth + deltaX > 200 ? startWidth + deltaX : 200;

            container.style.width = newWidth + 'px';
            img.style.width = newWidth + 'px';
          };

          const onMouseUp = () => {
            if (isResizing) {
              isResizing = false;
            }
            dispatchNodeView();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });

        rightController.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isResizing = true;
          startX = e.clientX;
          startWidth = container.offsetWidth;

          const onMouseMove = (mountEvent: MouseEvent) => {
            if (!isResizing) return;
            const deltaX = mountEvent.clientX - startX;
            const newWidth = startWidth + deltaX > 200 ? startWidth + deltaX : 200;

            container.style.width = newWidth + 'px';
            img.style.width = newWidth + 'px';
          };

          const onMouseUp = () => {
            if (isResizing) {
              isResizing = false;
            }
            dispatchNodeView();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });

        controllers.appendChild(leftController);
        controllers.appendChild(centerSpace);
        controllers.appendChild(rightController);
        container.appendChild(controllers);
      };

      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        img.setAttribute(key, value);
      });

      content.appendChild(img);
      container.appendChild(content);

      container.addEventListener('click', () => {
        const isMobile = document.documentElement.clientWidth < 768;

        if (container.childElementCount > 1) {
          container.removeChild(container.lastChild as Node);
        }

        // TODO: Check event touch
        if (!isMobile) {
          paintPositionContoller();
        }
      });

      document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const isClickInside = container.contains(target);

        if (!isClickInside) {
          if (container.childElementCount > 1) {
            container.removeChild(container.lastChild as Node);
          }
        }
      });

      return {
        dom: container,
      };
    };
  },
});
