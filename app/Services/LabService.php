<?php

namespace App\Services;

use App\Models\Lab;
use App\Models\LabUsageLog;

class LabService
{
    public function logUsage(Lab $lab, array $data): LabUsageLog
    {
        return $lab->usageLogs()->create($data);
    }

    public function markReturned(LabUsageLog $log): LabUsageLog
    {
        $log->update(['returned_at' => now()]);

        return $log->fresh();
    }

    public function lowStockResources(Lab $lab, int $threshold = 3)
    {
        return $lab->resources()->where('quantity', '<=', $threshold)->get();
    }
}
