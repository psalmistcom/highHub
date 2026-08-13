<?php

namespace App\Http\Middleware;

use App\Models\ConstructionWood;
use App\Models\PrefabricatedTimber;
use App\Models\WoodCladding;
use App\Models\WoodDecking;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'nav' => fn() => $this->navigation(),
        ];
    }

    private function navigation(): array
    {
        return [
            $this->group('Wood Decking', 'wood-decking', WoodDecking::class),
            $this->group('Wood Cladding', 'wood-cladding', WoodCladding::class),
            $this->group('Prefabricated Timber', 'prefabricated-timber', PrefabricatedTimber::class),
            $this->group('Construction Wood', 'construction-wood', ConstructionWood::class),
        ];
    }

    private function group(string $label, string $categorySlug, string $modelClass): array
    {
        return [
            'label' => $label,
            'href' => "/{$categorySlug}",
            'items' => $modelClass::query()
                ->select('title', 'slug')
                ->orderBy('title')
                ->get()
                ->map(fn($row) => [
                    'label' => $row->title,
                    'href' => "/{$categorySlug}/{$row->slug}",
                ])
                ->all(),
        ];
    }
}
