export const resources = {
  es: {
    translation: {
      common: {
        appName: "Uni Route",
        metaDescription:
          "Uni Route convierte resultados de traceroute en saltos, latencia y mapas para aprender cómo viaja una conexión por internet.",
        repository: "Repositorio",
        sourceCode: "Código fuente",
        openLocal: "Abrir Route Local",
        openGlobal: "Abrir Route Global",
        loading: "Cargando...",
        noData: "Sin datos",
        unknown: "No identificado",
        missingIp: "Sin IP",
        unavailableLocation: "Ubicación no disponible",
        unavailableHostname: "Sin hostname",
        unavailableOrganization: "Sin organización",
        language: "Idioma",
        spanish: "Español",
        english: "English",
      },
      nav: {
        aria: "Navegación principal",
        tagline: "Visualiza rutas, latencia y saltos de red",
        mobileMenu: "Abrir menú",
        mobileDescription: "Analiza rutas locales y globales desde una vista clara.",
        links: {
          home: "Inicio",
          local: "Route Local",
          global: "Route Global",
          resources: "Uso responsable",
        },
        descriptions: {
          home: "Empieza rápido y aprende mejor",
          local: "Pega o carga tu traceroute y analízalo",
          global: "Compara rutas desde otras regiones",
          resources: "Buenas prácticas y créditos necesarios",
        },
        footerPrimary:
          "Aprende traceroute con una experiencia visual pensada para estudiantes y exploración guiada.",
        footerSecondary:
          "Compara rutas locales y globales para entender cómo cambia internet según el origen.",
        footerResponsible: "Usa trazas y herramientas públicas con respeto.",
      },
      home: {
        badges: {
          visual: "Aprende redes visualmente",
          scope: "Local y global",
        },
        tagline: "Traza, compara y aprende.",
        title: "Entiende por dónde viaja tu conexión a internet.",
        description:
          "Convierte una salida de traceroute en puntos geográficos aproximados, saltos IP, latencia y comparación entre regiones.",
        primaryCta: "Analizar mi traceroute",
        secondaryCta: "Comparar desde el mundo",
        mapPreview: {
          eyebrow: "Saltos IP geolocalizados",
          title: "Puntos aproximados entre redes, no calles.",
          active: "{{label}} activo",
          sampleIp: "IP de ejemplo",
          points: {
            origin: { label: "Origen", location: "Caribe" },
            hop2: { label: "Salto 2", location: "Miami" },
            hop3: { label: "Salto 3", location: "Nueva York" },
            hop4: { label: "Salto 4", location: "Londres" },
            destination: { label: "Destino", location: "Frankfurt" },
          },
        },
        stats: {
          modes: "formas de explorar",
          views: "vistas del resultado",
          web: "aprendizaje web",
        },
        heroHighlights: {
          paste: {
            title: "Pega",
            description: "Usa texto o archivo de traceroute.",
          },
          observe: {
            title: "Observa",
            description: "Lee saltos IP, mapa y latencia juntos.",
          },
          compare: {
            title: "Compara",
            description: "Prueba rutas desde otras regiones.",
          },
        },
        quickActions: {
          local: {
            title: "Analiza una ruta local",
            description: "Pega la salida de tu terminal y mira cada salto como tabla, mapa y gráfica.",
            cta: "Empezar con mi equipo",
          },
          global: {
            title: "Compara otra región",
            description:
              "Usa herramientas públicas para observar cómo cambia la ruta desde otros continentes.",
            cta: "Explorar rutas globales",
          },
        },
        learnCards: {
          path: {
            title: "Dónde pasa la conexión",
            description: "Identifica saltos, redes intermedias e IPs privadas sin leer una pared de texto.",
          },
          latency: {
            title: "Qué salto se demora más",
            description: "Compara latencias por punto y detecta cambios bruscos en segundos.",
          },
          region: {
            title: "Por qué una región cambia la ruta",
            description: "Contrasta resultados locales y globales para aprender cómo se mueve internet.",
          },
        },
        sections: {
          choose: {
            eyebrow: "Elige cómo aprender",
            title: "Empieza con una traza real en menos de un minuto.",
          },
          read: {
            eyebrow: "Lee la ruta visualmente",
            title: "Lee internet paso a paso, sin memorizar comandos complicados.",
            description:
              "Uni Route te guía desde el texto que ya tienes hasta una vista clara para estudiar, enseñar o comparar rutas.",
          },
          steps: {
            eyebrow: "Cómo empezar",
            title: "Tres pasos y ya estás explorando.",
            description:
              "Si ya tienes una salida de traceroute, puedes entrar directo. Si no, cada herramienta te muestra qué copiar.",
          },
        },
        steps: {
          one: {
            label: "1",
            title: "Consigue una traza",
            description: "Usa tu terminal o una herramienta pública y copia el resultado completo.",
          },
          two: {
            label: "2",
            title: "Pégala en Uni Route",
            description: "Elige si viene de tu equipo o de otra región y analiza el texto.",
          },
          three: {
            label: "3",
            title: "Lee la ruta visualmente",
            description: "Explora saltos, tiempos y ubicación aproximada desde una sola vista.",
          },
        },
        responsible: {
          eyebrow: "Explora con cuidado",
          title: "Empieza con una ruta y comparte solo lo necesario.",
          description:
            "Revisa datos sensibles antes de publicar una traza y usa las herramientas públicas de forma respetuosa.",
          localCta: "Ir a Route Local",
          resourcesCta: "Ver uso responsable",
        },
      },
      local: {
        badge: "Route Local",
        title: "Analiza una ruta generada en tu propio equipo",
        description:
          "Ejecuta un comando, pega la salida o carga un archivo, y convierte el resultado en saltos, latencia y mapa.",
        howTo: {
          title: "Cómo obtener la traza",
          description: "Por seguridad, el navegador no ejecuta comandos de tu sistema.",
          body:
            "Abre una terminal, ejecuta el comando sugerido y pega aquí el resultado. También puedes guardar la salida en un archivo de texto y subirlo.",
        },
        form: {
          title: "Prepara tu resultado",
          description: "Elige tu sistema para que Uni Route lea mejor el texto que vas a pegar.",
          osLabel: "Sistema operativo",
          suggestedCommand: "Comando sugerido",
          copy: "Copiar",
          copied: "Copiado",
          copyAria: "Copiar comando para {{label}}",
          inputMode: "Cómo vas a ingresar el resultado",
          paste: "Pegar texto",
          file: "Archivo",
          loadedFile: "Archivo cargado: {{fileName}}",
          uploadHint: "Carga un archivo con la salida textual del traceroute.",
          outputLabel: "Salida del traceroute",
          outputPlaceholder: "Pega aquí la salida completa del traceroute...",
          analyze: "Analizar traceroute",
          errorTitle: "No se pudo iniciar el análisis",
          emptyTitle: "Todavía no hay resultados locales",
          emptyDescription: "Pega una salida de traceroute o carga un archivo para ver hops, mapa y latencia.",
        },
        sources: {
          windows: {
            label: "Windows",
            hint: "Copia el resultado completo que aparece después de ejecutar `tracert`.",
          },
          linux: {
            label: "Linux / macOS",
            hint: "Copia todas las líneas que devuelve `traceroute`, incluso las que tengan asteriscos.",
          },
        },
        errors: {
          empty: "Pega una salida de traceroute o carga un archivo antes de analizar.",
          fileRead: "No fue posible leer el archivo seleccionado.",
          copy: "No fue posible copiar el comando: {{message}}",
          copyFallback: "No fue posible copiar el comando. Cópialo manualmente desde la tarjeta.",
        },
        tips: {
          title: "Consejos rápidos",
          description: "Pequeñas pistas para que el resultado sea más fácil de interpretar.",
          capture: {
            title: "Cómo capturar la salida correctamente",
            body:
              "Copia el bloque completo desde el primer encabezado hasta el último hop. Mantén líneas con asteriscos porque ayudan a entender saltos sin respuesta.",
          },
          private: {
            title: "Qué pasa con IPs privadas o internas",
            body:
              "Uni Route detecta rangos privados, reservados o internos antes de consultar geolocalización para no gastar cuota en IPs sin coordenadas públicas.",
          },
          sharing: {
            title: "Qué revisar antes de compartir una traza",
            body:
              "Revisa si aparecen nombres de hosts internos, direcciones privadas o datos que prefieras ocultar antes de publicar el resultado.",
          },
        },
      },
      global: {
        badge: "Route Global",
        publicTools: "Herramientas públicas",
        title: "Compara cómo cambia la ruta desde otras regiones del mundo",
        description:
          "Elige un continente, abre una herramienta pública, ejecuta la traza y pega el resultado para verlo con la misma claridad que una ruta local.",
        externalAlert: {
          title: "Las herramientas se abren fuera de Uni Route",
          description:
            "Muchos servicios públicos no permiten integrarse dentro de otras páginas. Abrirlos en una pestaña nueva es más confiable y respeta sus reglas de uso.",
        },
        toolsTitle: "Herramientas globales",
        toolsDescription:
          "Selecciona una región de origen y copia el resultado que devuelva la herramienta externa.",
        destinationLabel: "Destino a estudiar",
        destinationPlaceholder: "IP o dominio",
        openTool: "Abrir herramienta",
        useProfile: "Usar este perfil",
        pasteTitle: "Pega el resultado",
        pasteDescription:
          "Uni Route intentará leerlo con el formato sugerido. Si no encaja, prueba otro formato de la lista.",
        activeTool: "Herramienta activa: {{name}}",
        suggestedDestination: "Destino sugerido para copiar en la herramienta externa:",
        resultFormat: "Formato del resultado",
        rawResult: "Resultado bruto",
        rawPlaceholder: "Pega aquí la salida textual de la looking glass...",
        errorTitle: "No se pudo iniciar el análisis global",
        analyze: "Analizar salida global",
        reopenTool: "Reabrir herramienta",
        emptyTitle: "Todavía no hay resultados globales",
        emptyDescription:
          "Abre una looking glass, ejecuta traceroute desde el continente deseado y pega aquí la salida para comparar regiones.",
        errors: {
          empty: "Pega el resultado que te devolvió la looking glass antes de analizar.",
        },
        status: {
          recommended: "Sugerida",
          backup: "Alternativa",
          directory: "Multi-región",
        },
      },
      resources: {
        badge: "Uso responsable",
        guide: "Guía rápida",
        title: "Aprende y comparte trazas sin exponer de más.",
        description:
          "Estas pautas te ayudan a usar Uni Route en clase, estudio personal o diagnóstico básico con respeto por tu privacidad y por servicios públicos.",
        communityEyebrow: "En comunidad",
        communityTitle:
          "Las looking glasses son recursos compartidos por operadores y comunidades.",
        communityDescription:
          "Úsalas para aprender y comparar, no como herramientas de carga o monitoreo automatizado.",
        beforeSharing: {
          title: "Antes de compartir un resultado",
          description: "Una traza puede mostrar más información de la que parece a primera vista.",
        },
        usageRules: [
          "Usa las herramientas públicas como recursos compartidos: evita pruebas repetitivas o automatizadas.",
          "Antes de publicar una traza, revisa si aparecen nombres internos, hosts privados o datos que quieras ocultar.",
          "Incluye contexto cuando compartas resultados: origen aproximado, destino y fecha ayudan a interpretarlos.",
          "Si una herramienta externa falla, prueba otra región o vuelve más tarde en lugar de forzar consultas.",
        ],
        external: {
          title: "Qué esperar de las herramientas externas",
          description:
            "Cada sitio puede cambiar su interfaz, exigir pasos manuales o estar temporalmente fuera de servicio.",
          bodyOne:
            "El flujo más estable es abrir la herramienta externa, ejecutar traceroute allí y pegar el resultado en Uni Route para visualizarlo.",
          bodyTwo:
            "Si un resultado no se interpreta bien, vuelve a la página global y prueba otro formato de salida.",
        },
        credits: {
          title: "Créditos necesarios",
          description: "Recursos externos que hacen posible la visualización del mapa.",
          items: {
            maplibre:
              "Motor de mapas usado para visualizar saltos con coordenadas.",
            carto: "Estilos base del mapa que incluyen atribución de OpenStreetMap.",
            osm: "Datos de mapa atribuidos por los estilos base utilizados en la visualización.",
          },
        },
        practice: {
          title: "Ir directo a la práctica",
          description:
            "Elige una ruta local si tienes una salida de tu equipo, o una ruta global para comparar regiones.",
        },
      },
      results: {
        metrics: {
          hops: {
            label: "Saltos",
            description: "Número total de hops detectados en la salida pegada.",
          },
          averageLatency: {
            label: "Latencia media",
            description: "Promedio calculado con las muestras encontradas en cada salto.",
          },
          publicIps: {
            label: "IPs públicas",
            description: "Saltos con IP pública candidata para geolocalización.",
          },
          mapPoints: {
            label: "Puntos en mapa",
            description: "Saltos que sí terminaron con coordenadas utilizables.",
          },
        },
        summary: {
          title: "Resumen del análisis",
          resolving: "Resolviendo geodatos...",
          destination: "Destino detectado:",
          warnings: "Observaciones del análisis",
          noCountries: "Todavía no hay países resueltos",
        },
        table: {
          title: "Tabla de hops",
          description: "Resultado normalizado para comparar IP, host, latencia y estado geográfico.",
          hop: "Hop",
          ip: "IP",
          host: "Host",
          latency: "Latencia",
          geoStatus: "Estado geo",
          location: "Ubicación",
          network: "Red",
          noLocation: "Sin ubicación",
        },
        latency: {
          title: "Latencia por salto",
          description: "Visualiza cómo cambia la latencia a medida que avanza la ruta.",
          emptyTitle: "Sin muestras de latencia",
          emptyDescription:
            "El resultado no incluyó tiempos en milisegundos suficientes para dibujar la gráfica.",
        },
      },
      map: {
        title: "Trayectoria geográfica",
        description:
          "Se dibuja solo con hops que lograron resolver coordenadas. Usa la reproducción para ver cómo la ruta avanza según la latencia de cada salto.",
        scaleNote: "La velocidad es una escala visual de la latencia, no tiempo real.",
        needPoints: "Se necesitan al menos dos puntos con coordenadas para reproducir.",
        hop: "Salto {{hop}}",
        ready: "Ruta lista",
        resolvedPoint: "Punto geográfico resuelto",
        noLatency: "Latencia no disponible",
        pendingTitle: "Mapa pendiente",
        pendingDescription:
          "No hubo suficientes hops con coordenadas. Si el resultado usa IPs privadas o la API no responde, el análisis textual sigue siendo útil.",
        actions: {
          restart: "Reiniciar",
          restartAria: "Reiniciar recorrido de la ruta",
          show: "Mostrar ruta",
          showAria: "Mostrar recorrido completo de la ruta",
          pause: "Pausar",
          pauseAria: "Pausar reproducción de la ruta",
          resume: "Continuar",
          resumeAria: "Continuar reproducción de la ruta",
          repeat: "Repetir",
          repeatAria: "Reproducir otra vez la ruta",
          play: "Reproducir",
          playAria: "Reproducir ruta geográfica",
        },
        status: {
          moving: "En movimiento",
          paused: "Pausado",
          complete: "Recorrido completo",
          ready: "Listo para reproducir",
        },
      },
      traceroute: {
        warnings: {
          noValidHops:
            "No se detectaron saltos válidos. Verifica que pegaste la salida completa o prueba otro formato de resultado.",
          unresolvedHops: "Se detectaron {{count}} saltos sin respuesta o sin IP visible.",
        },
        geoMessages: {
          missingIp: "El salto no expone una IP pública.",
          privateIp: "IP privada, reservada o interna; no se intenta geolocalizar.",
          pending: "Pendiente de resolución geográfica.",
          providerHttp: "{{provider}} respondió {{status}}.",
          notResolved: "No se pudo resolver la IP.",
          lookupFailed: "No fue posible resolver la geolocalización.",
        },
        geoStatus: {
          empty: "Sin datos",
          resolved: "Resuelta",
          private: "Privada",
          missingIp: "Sin IP",
          notFound: "No encontrada",
          providerUnconfigured: "Pendiente",
          error: "Error",
        },
        source: {
          windows: "Windows / tracert",
          linux: "Linux / macOS / traceroute",
          america: "Looking glass América",
          europa: "Looking glass Europa",
          asia: "Looking glass Asia",
          oceania: "Looking glass Oceanía",
        },
      },
      notFound: {
        title: "Ruta no encontrada",
        description: "La página que buscas no existe dentro de Uni Route.",
        cta: "Volver al inicio",
      },
      tools: {
        continents: {
          america: {
            label: "América",
            summary: "Compara cómo se ve la ruta desde redes troncales y carriers de Norteamérica.",
          },
          europa: {
            label: "Europa",
            summary: "Útil para contrastar latencia transatlántica y cambios de AS en redes europeas.",
          },
          asia: {
            label: "Asia",
            summary: "Sirve para observar desvíos, tránsitos largos y variaciones de salida hacia APAC.",
          },
          oceania: {
            label: "Oceanía",
            summary: "Ayuda a estudiar rutas largas y diferencias hacia Australia/Nueva Zelanda.",
          },
        },
        items: {
          "he-america": {
            notes:
              "Gran cobertura global y buena opción para estudiantes por la visibilidad de múltiples POPs.",
            instructions: [
              "Abre la herramienta en una nueva pestaña.",
              "Selecciona un POP en América y ejecuta traceroute al destino.",
              "Copia el bloque de texto del resultado y pégalo abajo.",
            ],
          },
          "lumen-america": {
            notes: "Buen complemento para contrastar con otra red troncal grande de América del Norte.",
            instructions: [
              "Ingresa el host o IP destino en la interfaz de Lumen.",
              "Ejecuta traceroute desde un nodo de América.",
              "Pega el resultado textual en este panel.",
            ],
          },
          "switch-europe": {
            notes: "Ideal para escenarios académicos y comparaciones con tráfico europeo.",
            instructions: [
              "Selecciona el nodo europeo que más te interese.",
              "Ejecuta traceroute y copia la salida generada.",
              "Si Uni Route no interpreta bien el texto, prueba el formato Linux/macOS.",
            ],
          },
          "cogent-europe": {
            notes: "Útil para comparar rutas en una red backbone diferente dentro de Europa.",
            instructions: [
              "Abre el portal de Cogent y elige un origen europeo.",
              "Corre traceroute contra tu destino de prueba.",
              "Pega el texto bruto aquí para analizarlo.",
            ],
          },
          "backwaves-asia": {
            notes: "Permite probar desde POPs en Asia y también sirve como respaldo multi-región.",
            instructions: [
              "Elige un POP asiático desde la interfaz.",
              "Ejecuta traceroute al host o IP que quieras estudiar.",
              "Copia la salida y úsala en este panel.",
            ],
          },
          "ilan-asia": {
            notes:
              "Complementa bien los resultados de Asia cuando quieres otro operador o punto de vista.",
            instructions: [
              "Abre la herramienta y lanza traceroute desde un nodo de la región.",
              "Usa el formato Linux/macOS si la salida se parece a traceroute clásico.",
              "Pega el resultado textual para visualizar los saltos.",
            ],
          },
          "telstra-oceania": {
            notes: "Muy útil para observar la ruta desde Australia y contrastar cambios en APAC.",
            instructions: [
              "Selecciona traceroute dentro del panel de Telstra.",
              "Lanza el diagnóstico hacia el destino que quieras medir.",
              "Copia el bloque de resultado y analízalo aquí.",
            ],
          },
          "globalping-directory": {
            notes:
              "Directorio multi-región con agentes distribuidos; también sirve como respaldo para cualquier continente.",
            instructions: [
              "Elige la región o país de interés dentro de Globalping.",
              "Ejecuta traceroute con el destino deseado.",
              "Pega el texto si el formato resultante se parece a traceroute clásico.",
            ],
          },
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        appName: "Uni Route",
        metaDescription:
          "Uni Route turns traceroute results into hops, latency, and maps to learn how a connection travels across the internet.",
        repository: "Repository",
        sourceCode: "Source code",
        openLocal: "Open Route Local",
        openGlobal: "Open Route Global",
        loading: "Loading...",
        noData: "No data",
        unknown: "Not identified",
        missingIp: "No IP",
        unavailableLocation: "Location unavailable",
        unavailableHostname: "No hostname",
        unavailableOrganization: "No organization",
        language: "Language",
        spanish: "Español",
        english: "English",
      },
      nav: {
        aria: "Main navigation",
        tagline: "Visualize routes, latency, and network hops",
        mobileMenu: "Open menu",
        mobileDescription: "Analyze local and global routes from a clear view.",
        links: {
          home: "Home",
          local: "Route Local",
          global: "Route Global",
          resources: "Responsible use",
        },
        descriptions: {
          home: "Start quickly and learn better",
          local: "Paste or upload your traceroute and analyze it",
          global: "Compare routes from other regions",
          resources: "Best practices and required credits",
        },
        footerPrimary:
          "Learn traceroute with a visual experience designed for students and guided exploration.",
        footerSecondary:
          "Compare local and global routes to understand how the internet changes by origin.",
        footerResponsible: "Use traces and public tools respectfully.",
      },
      home: {
        badges: {
          visual: "Learn networking visually",
          scope: "Local and global",
        },
        tagline: "Trace, compare, and learn.",
        title: "Understand where your internet connection travels.",
        description:
          "Turn traceroute output into approximate geographic points, IP hops, latency, and regional comparison.",
        primaryCta: "Analyze my traceroute",
        secondaryCta: "Compare from the world",
        mapPreview: {
          eyebrow: "Geolocated IP hops",
          title: "Approximate points between networks, not streets.",
          active: "{{label}} active",
          sampleIp: "Example IP",
          points: {
            origin: { label: "Origin", location: "Caribbean" },
            hop2: { label: "Hop 2", location: "Miami" },
            hop3: { label: "Hop 3", location: "New York" },
            hop4: { label: "Hop 4", location: "London" },
            destination: { label: "Destination", location: "Frankfurt" },
          },
        },
        stats: {
          modes: "ways to explore",
          views: "result views",
          web: "web learning",
        },
        heroHighlights: {
          paste: {
            title: "Paste",
            description: "Use traceroute text or a file.",
          },
          observe: {
            title: "Observe",
            description: "Read IP hops, map, and latency together.",
          },
          compare: {
            title: "Compare",
            description: "Test routes from other regions.",
          },
        },
        quickActions: {
          local: {
            title: "Analyze a local route",
            description: "Paste terminal output and see every hop as a table, map, and chart.",
            cta: "Start with my device",
          },
          global: {
            title: "Compare another region",
            description:
              "Use public tools to observe how the route changes from other continents.",
            cta: "Explore global routes",
          },
        },
        learnCards: {
          path: {
            title: "Where the connection passes",
            description: "Identify hops, intermediate networks, and private IPs without reading a wall of text.",
          },
          latency: {
            title: "Which hop takes longer",
            description: "Compare per-hop latency and detect sudden changes in seconds.",
          },
          region: {
            title: "Why a region changes the route",
            description: "Contrast local and global results to learn how the internet moves.",
          },
        },
        sections: {
          choose: {
            eyebrow: "Choose how to learn",
            title: "Start with a real trace in less than a minute.",
          },
          read: {
            eyebrow: "Read the route visually",
            title: "Read the internet step by step, without memorizing complicated commands.",
            description:
              "Uni Route guides you from the text you already have to a clear view for studying, teaching, or comparing routes.",
          },
          steps: {
            eyebrow: "How to start",
            title: "Three steps and you are already exploring.",
            description:
              "If you already have traceroute output, you can jump right in. If not, each tool shows what to copy.",
          },
        },
        steps: {
          one: {
            label: "1",
            title: "Get a trace",
            description: "Use your terminal or a public tool and copy the complete result.",
          },
          two: {
            label: "2",
            title: "Paste it into Uni Route",
            description: "Choose whether it came from your device or another region, then analyze the text.",
          },
          three: {
            label: "3",
            title: "Read the route visually",
            description: "Explore hops, timings, and approximate location from one view.",
          },
        },
        responsible: {
          eyebrow: "Explore carefully",
          title: "Start with a route and share only what is necessary.",
          description:
            "Review sensitive data before publishing a trace and use public tools respectfully.",
          localCta: "Go to Route Local",
          resourcesCta: "View responsible use",
        },
      },
      local: {
        badge: "Route Local",
        title: "Analyze a route generated on your own device",
        description:
          "Run a command, paste the output or upload a file, and turn the result into hops, latency, and a map.",
        howTo: {
          title: "How to get the trace",
          description: "For security, the browser does not execute commands on your system.",
          body:
            "Open a terminal, run the suggested command, and paste the result here. You can also save the output as a text file and upload it.",
        },
        form: {
          title: "Prepare your result",
          description: "Choose your system so Uni Route can read the text you will paste more accurately.",
          osLabel: "Operating system",
          suggestedCommand: "Suggested command",
          copy: "Copy",
          copied: "Copied",
          copyAria: "Copy command for {{label}}",
          inputMode: "How will you enter the result?",
          paste: "Paste text",
          file: "File",
          loadedFile: "Loaded file: {{fileName}}",
          uploadHint: "Upload a file with the textual traceroute output.",
          outputLabel: "Traceroute output",
          outputPlaceholder: "Paste the complete traceroute output here...",
          analyze: "Analyze traceroute",
          errorTitle: "The analysis could not start",
          emptyTitle: "There are no local results yet",
          emptyDescription: "Paste traceroute output or upload a file to see hops, map, and latency.",
        },
        sources: {
          windows: {
            label: "Windows",
            hint: "Copy the complete result shown after running `tracert`.",
          },
          linux: {
            label: "Linux / macOS",
            hint: "Copy every line returned by `traceroute`, including lines with asterisks.",
          },
        },
        errors: {
          empty: "Paste traceroute output or upload a file before analyzing.",
          fileRead: "The selected file could not be read.",
          copy: "The command could not be copied: {{message}}",
          copyFallback: "The command could not be copied. Copy it manually from the card.",
        },
        tips: {
          title: "Quick tips",
          description: "Small hints that make the result easier to interpret.",
          capture: {
            title: "How to capture the output correctly",
            body:
              "Copy the complete block from the first header to the last hop. Keep lines with asterisks because they help explain unanswered hops.",
          },
          private: {
            title: "What happens with private or internal IPs",
            body:
              "Uni Route detects private, reserved, or internal ranges before querying geolocation so API quota is not spent on IPs without public coordinates.",
          },
          sharing: {
            title: "What to review before sharing a trace",
            body:
              "Check whether internal hostnames, private addresses, or data you prefer to hide appear before publishing the result.",
          },
        },
      },
      global: {
        badge: "Route Global",
        publicTools: "Public tools",
        title: "Compare how the route changes from other world regions",
        description:
          "Choose a continent, open a public tool, run the trace, and paste the result to view it with the same clarity as a local route.",
        externalAlert: {
          title: "Tools open outside Uni Route",
          description:
            "Many public services do not allow embedding inside other pages. Opening them in a new tab is more reliable and respects their usage rules.",
        },
        toolsTitle: "Global tools",
        toolsDescription:
          "Select an origin region and copy the result returned by the external tool.",
        destinationLabel: "Destination to study",
        destinationPlaceholder: "IP or domain",
        openTool: "Open tool",
        useProfile: "Use this profile",
        pasteTitle: "Paste the result",
        pasteDescription:
          "Uni Route will try to read it with the suggested format. If it does not fit, try another format from the list.",
        activeTool: "Active tool: {{name}}",
        suggestedDestination: "Suggested destination to copy into the external tool:",
        resultFormat: "Result format",
        rawResult: "Raw result",
        rawPlaceholder: "Paste the looking glass text output here...",
        errorTitle: "The global analysis could not start",
        analyze: "Analyze global output",
        reopenTool: "Reopen tool",
        emptyTitle: "There are no global results yet",
        emptyDescription:
          "Open a looking glass, run traceroute from the desired continent, and paste the output here to compare regions.",
        errors: {
          empty: "Paste the result returned by the looking glass before analyzing.",
        },
        status: {
          recommended: "Suggested",
          backup: "Alternative",
          directory: "Multi-region",
        },
      },
      resources: {
        badge: "Responsible use",
        guide: "Quick guide",
        title: "Learn and share traces without exposing too much.",
        description:
          "These guidelines help you use Uni Route in class, personal study, or basic diagnostics while respecting your privacy and public services.",
        communityEyebrow: "In community",
        communityTitle:
          "Looking glasses are shared resources provided by operators and communities.",
        communityDescription:
          "Use them to learn and compare, not as load or automated monitoring tools.",
        beforeSharing: {
          title: "Before sharing a result",
          description: "A trace can show more information than it seems at first.",
        },
        usageRules: [
          "Use public tools as shared resources: avoid repetitive or automated tests.",
          "Before publishing a trace, check whether internal names, private hosts, or data you want to hide appear.",
          "Include context when sharing results: approximate origin, destination, and date help interpretation.",
          "If an external tool fails, try another region or come back later instead of forcing queries.",
        ],
        external: {
          title: "What to expect from external tools",
          description:
            "Each site can change its interface, require manual steps, or be temporarily unavailable.",
          bodyOne:
            "The most stable flow is to open the external tool, run traceroute there, and paste the result into Uni Route for visualization.",
          bodyTwo:
            "If a result is not interpreted correctly, return to the global page and try another output format.",
        },
        credits: {
          title: "Required credits",
          description: "External resources that make map visualization possible.",
          items: {
            maplibre: "Map engine used to visualize hops with coordinates.",
            carto: "Base map styles that include OpenStreetMap attribution.",
            osm: "Map data attributed by the base styles used in the visualization.",
          },
        },
        practice: {
          title: "Go straight to practice",
          description:
            "Choose a local route if you have output from your device, or a global route to compare regions.",
        },
      },
      results: {
        metrics: {
          hops: {
            label: "Hops",
            description: "Total number of hops detected in the pasted output.",
          },
          averageLatency: {
            label: "Average latency",
            description: "Average calculated from the samples found in each hop.",
          },
          publicIps: {
            label: "Public IPs",
            description: "Hops with a public IP candidate for geolocation.",
          },
          mapPoints: {
            label: "Map points",
            description: "Hops that ended with usable coordinates.",
          },
        },
        summary: {
          title: "Analysis summary",
          resolving: "Resolving geodata...",
          destination: "Detected destination:",
          warnings: "Analysis notes",
          noCountries: "No countries resolved yet",
        },
        table: {
          title: "Hop table",
          description: "Normalized result to compare IP, host, latency, and geographic status.",
          hop: "Hop",
          ip: "IP",
          host: "Host",
          latency: "Latency",
          geoStatus: "Geo status",
          location: "Location",
          network: "Network",
          noLocation: "No location",
        },
        latency: {
          title: "Latency by hop",
          description: "Visualize how latency changes as the route advances.",
          emptyTitle: "No latency samples",
          emptyDescription:
            "The result did not include enough millisecond timings to draw the chart.",
        },
      },
      map: {
        title: "Geographic path",
        description:
          "Only hops that resolved coordinates are drawn. Use playback to see how the route advances according to each hop's latency.",
        scaleNote: "Speed is a visual latency scale, not real time.",
        needPoints: "At least two points with coordinates are required to play the route.",
        hop: "Hop {{hop}}",
        ready: "Route ready",
        resolvedPoint: "Resolved geographic point",
        noLatency: "Latency unavailable",
        pendingTitle: "Map pending",
        pendingDescription:
          "There were not enough hops with coordinates. If the result uses private IPs or the API does not respond, the textual analysis is still useful.",
        actions: {
          restart: "Restart",
          restartAria: "Restart route playback",
          show: "Show route",
          showAria: "Show the complete route path",
          pause: "Pause",
          pauseAria: "Pause route playback",
          resume: "Continue",
          resumeAria: "Continue route playback",
          repeat: "Repeat",
          repeatAria: "Play the route again",
          play: "Play",
          playAria: "Play geographic route",
        },
        status: {
          moving: "Moving",
          paused: "Paused",
          complete: "Path complete",
          ready: "Ready to play",
        },
      },
      traceroute: {
        warnings: {
          noValidHops:
            "No valid hops were detected. Check that you pasted the complete output or try another result format.",
          unresolvedHops: "{{count}} hops without response or visible IP were detected.",
        },
        geoMessages: {
          missingIp: "The hop does not expose a public IP.",
          privateIp: "Private, reserved, or internal IP; geolocation is not attempted.",
          pending: "Pending geographic resolution.",
          providerHttp: "{{provider}} responded with {{status}}.",
          notResolved: "The IP could not be resolved.",
          lookupFailed: "Geolocation could not be resolved.",
        },
        geoStatus: {
          empty: "No data",
          resolved: "Resolved",
          private: "Private",
          missingIp: "No IP",
          notFound: "Not found",
          providerUnconfigured: "Pending",
          error: "Error",
        },
        source: {
          windows: "Windows / tracert",
          linux: "Linux / macOS / traceroute",
          america: "America looking glass",
          europa: "Europe looking glass",
          asia: "Asia looking glass",
          oceania: "Oceania looking glass",
        },
      },
      notFound: {
        title: "Route not found",
        description: "The page you are looking for does not exist inside Uni Route.",
        cta: "Back home",
      },
      tools: {
        continents: {
          america: {
            label: "America",
            summary: "Compare what the route looks like from North American backbones and carriers.",
          },
          europa: {
            label: "Europe",
            summary: "Useful to contrast transatlantic latency and AS changes across European networks.",
          },
          asia: {
            label: "Asia",
            summary: "Helps observe detours, long transits, and APAC egress variations.",
          },
          oceania: {
            label: "Oceania",
            summary: "Helps study long routes and differences toward Australia/New Zealand.",
          },
        },
        items: {
          "he-america": {
            notes:
              "Broad global coverage and a good student-friendly option because it exposes multiple POPs.",
            instructions: [
              "Open the tool in a new tab.",
              "Select a POP in America and run traceroute to the destination.",
              "Copy the result text block and paste it below.",
            ],
          },
          "lumen-america": {
            notes: "A good complement for contrasting another large North American backbone.",
            instructions: [
              "Enter the destination host or IP in the Lumen interface.",
              "Run traceroute from an American node.",
              "Paste the textual result into this panel.",
            ],
          },
          "switch-europe": {
            notes: "Ideal for academic scenarios and comparisons with European traffic.",
            instructions: [
              "Select the European node that interests you.",
              "Run traceroute and copy the generated output.",
              "If Uni Route does not interpret the text well, try the Linux/macOS format.",
            ],
          },
          "cogent-europe": {
            notes: "Useful for comparing routes in a different backbone network within Europe.",
            instructions: [
              "Open the Cogent portal and choose a European origin.",
              "Run traceroute against your test destination.",
              "Paste the raw text here for analysis.",
            ],
          },
          "backwaves-asia": {
            notes: "Lets you test from Asian POPs and also works as a multi-region backup.",
            instructions: [
              "Choose an Asian POP from the interface.",
              "Run traceroute to the host or IP you want to study.",
              "Copy the output and use it in this panel.",
            ],
          },
          "ilan-asia": {
            notes:
              "Complements Asian results when you want another operator or point of view.",
            instructions: [
              "Open the tool and run traceroute from a regional node.",
              "Use the Linux/macOS format if the output looks like classic traceroute.",
              "Paste the textual result to visualize hops.",
            ],
          },
          "telstra-oceania": {
            notes: "Very useful to observe the route from Australia and contrast APAC changes.",
            instructions: [
              "Select traceroute inside the Telstra panel.",
              "Launch the diagnostic toward the destination you want to measure.",
              "Copy the result block and analyze it here.",
            ],
          },
          "globalping-directory": {
            notes:
              "Multi-region directory with distributed agents; also works as a fallback for any continent.",
            instructions: [
              "Choose the region or country of interest inside Globalping.",
              "Run traceroute with the desired destination.",
              "Paste the text if the resulting format looks like classic traceroute.",
            ],
          },
        },
      },
    },
  },
} as const
